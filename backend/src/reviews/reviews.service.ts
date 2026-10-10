import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    @Optional()
    private notificationsService?: NotificationsService,
  ) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    // 1. Verify winner record exists
    const winner = await this.prisma.winner.findUnique({
      where: { id: dto.winnerId },
      include: {
        raffle: {
          include: {
            host: {
              include: {
                user: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!winner) {
      throw new NotFoundException('Winner prize record not found.');
    }

    // 2. Winner must belong to authenticated user
    if (winner.userId !== userId) {
      throw new ForbiddenException(
        'You can only review prizes that you have personally won.',
      );
    }

    // 3. Enforce 1 review per won product/winner record
    const existingReview = await this.prisma.review.findUnique({
      where: { winnerId: dto.winnerId },
    });

    if (existingReview) {
      throw new BadRequestException(
        'You have already submitted a review for this won prize.',
      );
    }

    const hostId = winner.raffle.hostId;

    // 4. Create review
    const review = await this.prisma.review.create({
      data: {
        hostId,
        raffleId: winner.raffleId,
        winnerId: winner.id,
        userId,
        rating: dto.rating,
        comment: dto.comment?.trim() || null,
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        winner: {
          select: {
            id: true,
            prizeName: true,
            winType: true,
          },
        },
      },
    });

    // 5. Notify host of the review
    if (this.notificationsService && winner.raffle?.host?.userId) {
      try {
        const reviewerName =
          `${winner.user.firstName || ''} ${winner.user.lastName || ''}`.trim() ||
          'A winner';
        await this.notificationsService.createNotification({
          userId: winner.raffle.host.userId,
          type: 'SYSTEM',
          title: 'New Customer Review Received',
          subtitle: `${reviewerName} left a ${dto.rating}★ review for "${winner.prizeName}".`,
          link: '/dashboard/host/reviews',
          metadata: {
            reviewId: review.id,
            hostId,
            rating: dto.rating,
            winnerId: winner.id,
          },
        });
      } catch (err) {
        console.error('Failed to send review notification to host:', err);
      }
    }

    return this.formatReview(review);
  }

  async getHostReviews(hostIdOrSlug: string, query?: ReviewQueryDto) {
    const host = await this.prisma.hostProfile.findFirst({
      where: {
        OR: [{ id: hostIdOrSlug }, { slug: hostIdOrSlug }],
      },
    });

    if (!host) {
      throw new NotFoundException('Host profile not found.');
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query?.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = {
      hostId: host.id,
      status: 'APPROVED',
    };

    if (query?.rating) {
      whereClause.rating = Number(query.rating);
    }

    // 1. Fetch total count & overall aggregate stats
    const [total, statsAggregate, breakdownGroup, reviews] =
      await Promise.all([
        this.prisma.review.count({ where: whereClause }),
        this.prisma.review.aggregate({
          where: { hostId: host.id, status: 'APPROVED' },
          _avg: { rating: true },
          _count: { rating: true },
        }),
        this.prisma.review.groupBy({
          by: ['rating'],
          where: { hostId: host.id, status: 'APPROVED' },
          _count: { rating: true },
        }),
        this.prisma.review.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
            raffle: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            winner: {
              select: {
                id: true,
                prizeName: true,
                winType: true,
              },
            },
          },
        }),
      ]);

    const totalApproved = statsAggregate._count.rating || 0;
    const averageRating = totalApproved > 0
      ? Number((statsAggregate._avg.rating || 0).toFixed(1))
      : null;

    // Build 1-5 breakdown
    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const percentages: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    breakdownGroup.forEach((b) => {
      breakdown[b.rating] = b._count.rating;
    });

    if (totalApproved > 0) {
      for (let star = 1; star <= 5; star++) {
        percentages[star] = Math.round((breakdown[star] / totalApproved) * 100);
      }
    }

    return {
      reviews: reviews.map((r) => this.formatReview(r)),
      stats: {
        averageRating,
        totalReviews: totalApproved,
        breakdown,
        percentages,
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getMyReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            logoUrl: true,
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
            mainImage: true,
          },
        },
        winner: {
          select: {
            id: true,
            prizeName: true,
            winType: true,
          },
        },
      },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      winnerId: r.winnerId,
      prizeName: r.winner?.prizeName,
      winType: r.winner?.winType,
      competition: {
        id: r.raffle?.id,
        title: r.raffle?.title,
        slug: r.raffle?.slug,
      },
      host: {
        id: r.host?.id,
        name: r.host?.businessName,
        slug: r.host?.slug || r.host?.id,
      },
    }));
  }

  async getHostReviewsDashboard(userId: string, query?: ReviewQueryDto) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (!host) {
      throw new NotFoundException('Host profile not found for this user.');
    }

    return this.getHostReviews(host.id, query);
  }

  async updateReview(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own review.');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating ? { rating: dto.rating } : {}),
        ...(dto.comment !== undefined ? { comment: dto.comment?.trim() || null } : {}),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        winner: {
          select: {
            id: true,
            prizeName: true,
            winType: true,
          },
        },
      },
    });

    return this.formatReview(updated);
  }

  async flagReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { status: 'FLAGGED' },
    });

    return { message: 'Review has been flagged for moderation.' };
  }

  private formatReview(r: any) {
    const reviewerName = r.user
      ? `${r.user.firstName || 'Verified'} ${r.user.lastName ? r.user.lastName[0] + '.' : 'Winner'}`.trim()
      : 'Verified Winner';

    return {
      id: r.id,
      hostId: r.hostId,
      raffleId: r.raffleId,
      winnerId: r.winnerId,
      reviewerName,
      avatarUrl: r.user?.avatarUrl || null,
      rating: r.rating,
      message: r.comment || '',
      comment: r.comment || '',
      competitionTitle: r.raffle?.title || 'Airsoft Competition',
      competitionSlug: r.raffle?.slug || r.raffle?.id,
      prizeName: r.winner?.prizeName || r.raffle?.title,
      winType: r.winner?.winType || 'MAIN_DRAW',
      status: r.status,
      createdAt: r.createdAt,
      canBeFlagged: r.status !== 'FLAGGED',
    };
  }
}
