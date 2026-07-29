import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HostsService {
  constructor(private prisma: PrismaService) {}

  async findAllVerifiedPublic() {
    const hosts = await this.prisma.hostProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            raffles: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    return hosts.map((host) => ({
      id: host.id,
      slug: host.slug || host.id,
      name: host.businessName,
      logo: host.user.avatarUrl,
      description: null, // Host description can be added later
      category: null,
      competitionCount: host._count.raffles,
      averageRating: 5.0, // Mocked for now
      totalReviews: 12, // Mocked for now
      isVerified: host.isVerified,
    }));
  }

  async findOnePublic(slug: string) {
    const host = await this.prisma.hostProfile.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffles: {
          where: {
            status: {
              in: ['ACTIVE', 'ENDED'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            instantWins: true,
          },
        },
        _count: {
          select: {
            raffles: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    return {
      id: host.id,
      slug: host.slug || host.id,
      name: host.businessName,
      logo: host.user.avatarUrl,
      bio: null,
      isVerified: host.isVerified,
      drawsHosted: host._count.raffles,
      rating: 5.0, // Mocked
      memberSince: host.createdAt.getFullYear(),
      raffles: host.raffles.map((raffle) => {
        // Format endDate as "Ends in Xd Yh" or a clean date string
        const end = new Date(raffle.endDate);
        const formattedEndDate = end.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return {
          id: raffle.id,
          slug: raffle.slug || raffle.id,
          title: raffle.title,
          description: raffle.description,
          image: raffle.mainImage || '/images/default-raffle.png',
          ticketPrice: raffle.pricePerTicket
            ? Number(raffle.pricePerTicket.toString())
            : 0,
          totalTickets: raffle.totalTickets,
          soldTickets: raffle.ticketsSold,
          endDate: `Ends ${formattedEndDate}`,
          status: raffle.status, // ACTIVE, ENDED, etc.
          category: 'airsoft', // Default or add to schema later
          isInstantWin: raffle.instantWins?.length > 0,
          instantWinsCount: raffle.instantWins?.length || 0,
        };
      }),
    };
  }

  async getHostProfileByUserId(userId: string) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });
    if (!host) {
      throw new NotFoundException('Host profile not found for this user');
    }
    return host;
  }

  async getWalletStats(userId: string) {
    const host = await this.getHostProfileByUserId(userId);

    // Sum pending withdrawals
    const pendingWithdrawals = await this.prisma.withdrawal.aggregate({
      where: {
        hostId: host.id,
        status: 'PENDING',
      },
      _sum: {
        amount: true,
      },
    });

    // Sum completed withdrawals for fees paid
    const completedWithdrawals = await this.prisma.withdrawal.aggregate({
      where: {
        hostId: host.id,
        status: { in: ['COMPLETED', 'APPROVED', 'PENDING'] },
      },
      _sum: {
        feeAmount: true,
        amount: true,
      },
    });

    // Sum total ticket sales across host raffles
    const raffles = await this.prisma.raffle.findMany({
      where: { hostId: host.id },
      select: {
        pricePerTicket: true,
        ticketsSold: true,
      },
    });

    const totalLifetimeEarnings = raffles.reduce((acc, r) => {
      return acc + Number(r.pricePerTicket) * r.ticketsSold;
    }, 0);

    const availableBalance = Number(host.walletBalance);
    const pendingClearance = Number(pendingWithdrawals._sum.amount || 0);
    const totalFeesPaid = Number(completedWithdrawals._sum.feeAmount || 0);

    return {
      availableBalance,
      pendingClearance,
      totalLifetimeEarnings,
      totalFeesPaid,
      commissionRate: 10.0, // 10% Platform fee
    };
  }

  async requestWithdrawal(
    userId: string,
    dto: { amount: number; payoutMethod: string; payoutDetails: Record<string, any> },
  ) {
    const host = await this.getHostProfileByUserId(userId);
    const currentBalance = Number(host.walletBalance);

    if (dto.amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    if (dto.amount > currentBalance) {
      throw new BadRequestException(
        `Insufficient wallet balance. You have £${currentBalance.toFixed(2)} available.`,
      );
    }

    // 10% platform fee calculation
    const feeAmount = dto.amount * 0.10;
    const netAmount = dto.amount * 0.90;

    const result = await this.prisma.$transaction(async (tx) => {
      // Deduct requested amount from host's wallet balance
      await tx.hostProfile.update({
        where: { id: host.id },
        data: {
          walletBalance: {
            decrement: dto.amount,
          },
        },
      });

      // Create Withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          hostId: host.id,
          amount: dto.amount,
          feeAmount: feeAmount,
          netAmount: netAmount,
          payoutMethod: dto.payoutMethod,
          payoutDetails: JSON.stringify(dto.payoutDetails),
          status: 'PENDING',
        },
      });

      // Log transaction
      await tx.transaction.create({
        data: {
          userId,
          type: 'HOST_WITHDRAWAL',
          amount: dto.amount,
          status: 'PENDING',
          relatedEntityId: withdrawal.id,
        },
      });

      return withdrawal;
    });

    return {
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: result.id,
        grossAmount: Number(result.amount),
        feeAmount: Number(result.feeAmount),
        feePercent: 10,
        netAmount: Number(result.netAmount),
        payoutMethod: result.payoutMethod,
        status: result.status,
        createdAt: result.createdAt,
      },
    };
  }

  async getWithdrawalsHistory(userId: string) {
    const host = await this.getHostProfileByUserId(userId);

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
    });

    return withdrawals.map((w) => {
      const grossAmount = Number(w.amount);
      const feeDeducted = Number(w.feeAmount || grossAmount * 0.10);
      const netAmount = Number(w.netAmount || grossAmount * 0.90);

      let parsedDetails = {};
      try {
        if (w.payoutDetails) parsedDetails = JSON.parse(w.payoutDetails);
      } catch (e) {
        parsedDetails = { raw: w.payoutDetails };
      }

      return {
        id: w.id,
        date: new Date(w.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        grossAmount,
        feeDeducted,
        feePercent: 10,
        netAmount,
        method: w.payoutMethod || 'Bank Transfer',
        status: w.status === 'COMPLETED' ? 'Paid' : w.status === 'PENDING' ? 'Processing' : w.status,
        referenceId: `WD-${w.id.substring(0, 8).toUpperCase()}`,
        payoutDetails: parsedDetails,
        adminNotes: w.adminNotes,
      };
    });
  }
}
