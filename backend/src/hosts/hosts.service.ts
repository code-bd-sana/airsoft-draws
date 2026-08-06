import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    // Sum completed withdrawals for fees paid (using amount to support all Prisma Client versions)
    const completedWithdrawals = await this.prisma.withdrawal.aggregate({
      where: {
        hostId: host.id,
        status: { in: ['COMPLETED', 'APPROVED', 'PENDING'] },
      },
      _sum: {
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
    const pendingClearance = Number(pendingWithdrawals._sum?.amount || 0);
    const totalFeesPaid = Number(completedWithdrawals._sum?.amount || 0) * 0.10;

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
    dto: {
      amount: number;
      payoutMethod: string;
      payoutDetails: Record<string, any>;
    },
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
    const feeAmount = dto.amount * 0.1;
    const netAmount = dto.amount * 0.9;

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
      const withdrawalData: any = {
        hostId: host.id,
        amount: dto.amount,
        feeAmount: feeAmount,
        netAmount: netAmount,
        payoutMethod: dto.payoutMethod,
        payoutDetails: JSON.stringify(dto.payoutDetails),
        status: 'PENDING',
      };

      const withdrawal = await tx.withdrawal.create({
        data: withdrawalData,
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

    const resObj = result as any;
    return {
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: result.id,
        grossAmount: Number(result.amount),
        feeAmount: Number(resObj.feeAmount || Number(result.amount) * 0.10),
        feePercent: 10,
        netAmount: Number(resObj.netAmount || Number(result.amount) * 0.90),
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
      const wObj = w as any;
      const grossAmount = Number(w.amount);
      const feeDeducted = Number(wObj.feeAmount || grossAmount * 0.1);
      const netAmount = Number(wObj.netAmount || grossAmount * 0.9);

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
        status:
          w.status === 'COMPLETED'
            ? 'Paid'
            : w.status === 'PENDING'
              ? 'Processing'
              : w.status,
        referenceId: `WD-${w.id.substring(0, 8).toUpperCase()}`,
        payoutDetails: parsedDetails,
        adminNotes: w.adminNotes,
      };
    });
  }

  async getHostDashboardOverview(userId: string) {
    const host = await this.getHostProfileByUserId(userId);

    // Fetch all host raffles
    const hostRaffles = await this.prisma.raffle.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
      include: {
        instantWins: true,
        _count: {
          select: { tickets: true, winners: true },
        },
      },
    });

    const activeRaffles = hostRaffles.filter((r) => r.status === 'ACTIVE');
    const totalTicketsSold = hostRaffles.reduce((sum, r) => sum + r.ticketsSold, 0);

    const totalGrossRevenue = hostRaffles.reduce(
      (sum, r) => sum + Number(r.pricePerTicket) * r.ticketsSold,
      0,
    );
    const totalNetRevenue = totalGrossRevenue * 0.9; // 10% platform fee deducted

    const totalWinnersCount = await this.prisma.winner.count({
      where: { raffle: { hostId: host.id } },
    });

    // Recent Activity / Ticket Sales
    const recentTickets = await this.prisma.ticket.findMany({
      where: { raffle: { hostId: host.id } },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        raffle: { select: { title: true, pricePerTicket: true } },
      },
    });

    const recentActivity = recentTickets.map((t) => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      raffleTitle: t.raffle?.title || 'Airsoft Competition',
      buyerName: `${t.user?.firstName || 'User'} ${t.user?.lastName || ''}`.trim() || t.user?.email || 'Anonymous Client',
      amount: Number(t.raffle?.pricePerTicket || 0),
      createdAt: t.createdAt,
    }));

    // Formatted Active Raffles for UI
    const formattedActiveRaffles = activeRaffles.map((r) => {
      const percentageSold = r.totalTickets > 0 
        ? Math.min(100, Math.round((r.ticketsSold / r.totalTickets) * 100)) 
        : 0;

      return {
        id: r.id,
        slug: r.slug || r.id,
        title: r.title,
        image: r.mainImage || '/images/default-raffle.png',
        ticketPrice: Number(r.pricePerTicket),
        totalTickets: r.totalTickets,
        ticketsSold: r.ticketsSold,
        percentageSold,
        endDate: r.endDate,
        status: r.status,
        revenue: Number(r.pricePerTicket) * r.ticketsSold,
      };
    });

    // Upcoming Draws (Active or Ended raffles closest to expiry)
    const upcomingDraws = hostRaffles
      .filter((r) => r.status === 'ACTIVE' || r.status === 'ENDED')
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        title: r.title,
        endDate: r.endDate,
        ticketsSold: r.ticketsSold,
        totalTickets: r.totalTickets,
        status: r.status,
      }));

    return {
      kpiStats: {
        totalNetRevenue,
        totalGrossRevenue,
        availableBalance: Number(host.walletBalance),
        activeCompetitionsCount: activeRaffles.length,
        totalCompetitionsCount: hostRaffles.length,
        totalTicketsSold,
        totalWinnersCount,
      },
      activeRaffles: formattedActiveRaffles,
      upcomingDraws,
      recentActivity,
    };
  }
}
