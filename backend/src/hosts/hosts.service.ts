import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class HostsService {
  constructor(
    private prisma: PrismaService,
    @Optional()
    private notificationsService?: NotificationsService,
  ) {}

  async findAllVerifiedPublic() {
    const hosts = await this.prisma.hostProfile.findMany({
      where: {
        isVerified: true,
        user: {
          isBlocked: false,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isBlocked: true,
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
      logo: host.user?.avatarUrl || host.logoUrl,
      banner: host.bannerUrl || null,
      description: host.bio || null,
      bio: host.bio || null,
      phone: host.phone || null,
      address: host.address || null,
      category: null,
      competitionCount: host._count.raffles,
      averageRating: 5.0, // Mocked for now
      totalReviews: 12, // Mocked for now
      isVerified: host.isVerified,
      isBlocked: host.user.isBlocked ?? false,
    }));
  }

  async findOnePublic(slug: string) {
    const host = await this.prisma.hostProfile.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        user: {
          isBlocked: false,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isBlocked: true,
          },
        },
        raffles: {
          where: {
            status: {
              in: ['ACTIVE', 'ENDED', 'COMPLETED'],
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
                status: {
                  in: ['ACTIVE', 'ENDED', 'COMPLETED'],
                },
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
      logo: host.user?.avatarUrl || host.logoUrl,
      banner: host.bannerUrl || null,
      bio: host.bio || null,
      phone: host.phone || null,
      address: host.address || null,
      vatNumber: host.vatNumber || null,
      isVerified: host.isVerified,
      drawsHosted: host._count.raffles,
      rating: 5.0, // Mocked
      memberSince: host.createdAt.getFullYear(),
      raffles: host.raffles.map((raffle) => {
        // Format endDate as "Ends in Xd Yh" or a clean date string
        const end = new Date(raffle.endDate);
        const formattedEndDate = end.toLocaleDateString('en-GB', {
          timeZone: 'Europe/London',
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
          category: raffle.category || 'airsoft',
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

  private async getHostActiveSubscription(hostId: string) {
    return this.prisma.hostSubscription.findFirst({
      where: {
        hostId,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private isProOrPremium(sub: any): boolean {
    if (!sub || !sub.plan) return false;
    const name = (sub.plan.name || '').toUpperCase();
    const price = Number(sub.plan.price || 0);
    return name.includes('PREMIUM') || name.includes('PRO') || price > 0;
  }

  async getWalletStats(userId: string) {
    const host = await this.getHostProfileByUserId(userId);
    const activeSub = await this.getHostActiveSubscription(host.id);
    const isPaidPlan = this.isProOrPremium(activeSub);
    const feeRate = isPaidPlan ? 0.10 : 0.15;
    const commissionRate = isPaidPlan ? 10.0 : 15.0;

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

    // Sum completed withdrawals for fees paid (using amount/feeAmount)
    const completedWithdrawals = await this.prisma.withdrawal.aggregate({
      where: {
        hostId: host.id,
        status: { in: ['COMPLETED', 'APPROVED', 'PENDING'] },
      },
      _sum: {
        amount: true,
        feeAmount: true,
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
    const totalFeesPaid = completedWithdrawals._sum?.feeAmount
      ? Number(completedWithdrawals._sum.feeAmount)
      : Number(completedWithdrawals._sum?.amount || 0) * feeRate;

    return {
      availableBalance,
      pendingClearance,
      totalLifetimeEarnings,
      totalFeesPaid,
      commissionRate,
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

    if (dto.payoutMethod !== 'BANK_TRANSFER') {
      throw new BadRequestException(
        'Withdrawals are Bank Transfer only. PayPal is not supported.',
      );
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    if (dto.amount > currentBalance) {
      throw new BadRequestException(
        `Insufficient wallet balance. You have £${currentBalance.toFixed(2)} available.`,
      );
    }

    const activeSub = await this.getHostActiveSubscription(host.id);
    const isPaidPlan = this.isProOrPremium(activeSub);
    const feeRate = isPaidPlan ? 0.10 : 0.15;
    const feePercent = isPaidPlan ? 10 : 15;

    // Platform fee calculation: 10% for Premium/Pro, 15% for Free
    const feeAmount = Number((dto.amount * feeRate).toFixed(2));
    const netAmount = Number((dto.amount - feeAmount).toFixed(2));

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
        payoutMethod: 'BANK_TRANSFER',
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

    if (this.notificationsService) {
      try {
        await this.notificationsService.notifyAdmins({
          type: 'WITHDRAWAL',
          title: 'New Withdrawal Request',
          subtitle: `${host.businessName || 'A host'} requested a payout of £${dto.amount.toFixed(2)}.`,
          link: '/dashboard/admin/withdrawals',
          metadata: {
            withdrawalId: result.id,
            hostId: host.id,
            amount: dto.amount,
          },
        });

        await this.notificationsService.createNotification({
          userId,
          type: 'WITHDRAWAL',
          title: 'Withdrawal Request Submitted',
          subtitle: `Your payout request of £${dto.amount.toFixed(2)} has been received and is pending review.`,
          link: '/dashboard/host/wallet',
          metadata: {
            withdrawalId: result.id,
            amount: dto.amount,
          },
        });
      } catch (notifErr) {
        console.error('Failed to dispatch withdrawal notifications:', notifErr);
      }
    }

    const resObj = result as any;
    return {
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: result.id,
        grossAmount: Number(result.amount),
        feeAmount: Number(resObj.feeAmount || feeAmount),
        feePercent,
        netAmount: Number(resObj.netAmount || netAmount),
        payoutMethod: result.payoutMethod,
        status: result.status,
        createdAt: result.createdAt,
      },
    };
  }

  async getWithdrawalsHistory(userId: string) {
    const host = await this.getHostProfileByUserId(userId);
    const activeSub = await this.getHostActiveSubscription(host.id);
    const isPaidPlan = this.isProOrPremium(activeSub);

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
    });

    return withdrawals.map((w) => {
      const wObj = w as any;
      const grossAmount = Number(w.amount);
      const feeDeducted = Number(
        wObj.feeAmount !== null && wObj.feeAmount !== undefined
          ? wObj.feeAmount
          : grossAmount * (isPaidPlan ? 0.10 : 0.15),
      );
      const netAmount = Number(
        wObj.netAmount !== null && wObj.netAmount !== undefined
          ? wObj.netAmount
          : grossAmount - feeDeducted,
      );
      const feePercent =
        grossAmount > 0
          ? Math.round((feeDeducted / grossAmount) * 100)
          : isPaidPlan
            ? 10
            : 15;

      let parsedDetails = {};
      try {
        if (w.payoutDetails) parsedDetails = JSON.parse(w.payoutDetails);
      } catch (e) {
        parsedDetails = { raw: w.payoutDetails };
      }

      return {
        id: w.id,
        date: new Date(w.createdAt).toLocaleDateString('en-GB', {
          timeZone: 'Europe/London',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        grossAmount,
        feeDeducted,
        feePercent,
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
    const activeSub = await this.getHostActiveSubscription(host.id);
    const isPaidPlan = this.isProOrPremium(activeSub);
    const feeRate = isPaidPlan ? 0.10 : 0.15;
    const platformFeeRate = isPaidPlan ? 10 : 15;
    const netEarningsRate = isPaidPlan ? 90 : 85;

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
    // Platform fee calculation: 10% for Premium/Pro (90% net), 15% for Free (85% net)
    const totalNetRevenue = Number((totalGrossRevenue * (1 - feeRate)).toFixed(2));

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
        images: (r as any).images?.length ? (r as any).images : (r.mainImage ? [r.mainImage] : []),
        ticketPrice: Number(r.pricePerTicket),
        pricePerTicket: Number(r.pricePerTicket),
        totalTickets: r.totalTickets,
        ticketsSold: r.ticketsSold,
        percentageSold,
        endDate: r.endDate,
        status: r.status,
        revenue: Number(r.pricePerTicket) * r.ticketsSold,
        totalAmount: Number(r.pricePerTicket) * r.ticketsSold,
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

    // All tickets for this host across time to compute periodic earnings
    const allHostTickets = await this.prisma.ticket.findMany({
      where: { raffle: { hostId: host.id } },
      select: {
        createdAt: true,
        raffle: { select: { pricePerTicket: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const calcNetTickets = (tickets: typeof allHostTickets) => {
      const gross = tickets.reduce(
        (sum, t) => sum + Number(t.raffle?.pricePerTicket || 0),
        0,
      );
      return Number((gross * (1 - feeRate)).toFixed(2));
    };

    let earningsChart: Record<string, { revenue: number; data: Array<{ label: string; revenue: number }> }>;

    if (allHostTickets.length > 0) {
      // 1. 7D
      const data7D: Array<{ label: string; revenue: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        const dayTickets = allHostTickets.filter(
          (t) => t.createdAt >= startOfDay && t.createdAt <= endOfDay,
        );
        data7D.push({
          label: i === 0 ? 'Today' : dayNames[d.getDay()],
          revenue: calcNetTickets(dayTickets),
        });
      }
      const rev7D = Number(data7D.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));

      // 2. 1M (last 30 days in 6 5-day intervals)
      const data1M: Array<{ label: string; revenue: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const dStart = new Date(now);
        dStart.setDate(dStart.getDate() - (i + 1) * 5);
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - i * 5);
        const intervalTickets = allHostTickets.filter(
          (t) => t.createdAt >= dStart && t.createdAt <= dEnd,
        );
        data1M.push({
          label: `${dEnd.getDate()} ${monthNames[dEnd.getMonth()]}`,
          revenue: calcNetTickets(intervalTickets),
        });
      }
      const rev1M = Number(data1M.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));

      // 3. 3M (last 90 days in 6 15-day intervals)
      const data3M: Array<{ label: string; revenue: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const dStart = new Date(now);
        dStart.setDate(dStart.getDate() - (i + 1) * 15);
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - i * 15);
        const intervalTickets = allHostTickets.filter(
          (t) => t.createdAt >= dStart && t.createdAt <= dEnd,
        );
        data3M.push({
          label: `${dEnd.getDate()} ${monthNames[dEnd.getMonth()]}`,
          revenue: calcNetTickets(intervalTickets),
        });
      }
      const rev3M = Number(data3M.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));

      // 4. 1Y (last 12 months)
      const data1Y: Array<{ label: string; revenue: number }> = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        const monthTickets = allHostTickets.filter(
          (t) => t.createdAt >= startOfMonth && t.createdAt <= endOfMonth,
        );
        data1Y.push({
          label: monthNames[d.getMonth()],
          revenue: calcNetTickets(monthTickets),
        });
      }
      const rev1Y = Number(data1Y.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));

      earningsChart = {
        '7D': { revenue: rev7D, data: data7D },
        '1M': { revenue: rev1M, data: data1M },
        '3M': { revenue: rev3M, data: data3M },
        '1Y': { revenue: rev1Y, data: data1Y },
      };
    } else {
      // If no individual ticket rows in database yet, calculate proportional values from totalNetRevenue
      const base = totalNetRevenue;
      earningsChart = {
        '7D': {
          revenue: Number((base * 0.35).toFixed(2)),
          data: [
            { label: 'Mon', revenue: Number((base * 0.02).toFixed(2)) },
            { label: 'Tue', revenue: Number((base * 0.04).toFixed(2)) },
            { label: 'Wed', revenue: Number((base * 0.03).toFixed(2)) },
            { label: 'Thu', revenue: Number((base * 0.06).toFixed(2)) },
            { label: 'Fri', revenue: Number((base * 0.08).toFixed(2)) },
            { label: 'Sat', revenue: Number((base * 0.05).toFixed(2)) },
            { label: 'Today', revenue: Number((base * 0.07).toFixed(2)) },
          ],
        },
        '1M': {
          revenue: Number((base * 0.7).toFixed(2)),
          data: [
            { label: 'Week 1', revenue: Number((base * 0.1).toFixed(2)) },
            { label: 'Week 2', revenue: Number((base * 0.15).toFixed(2)) },
            { label: 'Week 3', revenue: Number((base * 0.2).toFixed(2)) },
            { label: 'Week 4', revenue: Number((base * 0.25).toFixed(2)) },
          ],
        },
        '3M': {
          revenue: Number((base * 0.85).toFixed(2)),
          data: [
            { label: monthNames[(now.getMonth() - 2 + 12) % 12], revenue: Number((base * 0.2).toFixed(2)) },
            { label: monthNames[(now.getMonth() - 1 + 12) % 12], revenue: Number((base * 0.3).toFixed(2)) },
            { label: monthNames[now.getMonth()], revenue: Number((base * 0.35).toFixed(2)) },
          ],
        },
        '1Y': {
          revenue: base,
          data: [
            { label: 'Jan', revenue: Number((base * 0.04).toFixed(2)) },
            { label: 'Mar', revenue: Number((base * 0.06).toFixed(2)) },
            { label: 'May', revenue: Number((base * 0.1).toFixed(2)) },
            { label: 'Jul', revenue: Number((base * 0.18).toFixed(2)) },
            { label: 'Sep', revenue: Number((base * 0.28).toFixed(2)) },
            { label: 'Nov', revenue: Number((base * 0.34).toFixed(2)) },
          ],
        },
      };
    }

    return {
      kpiStats: {
        totalNetRevenue,
        totalGrossRevenue,
        platformFeeRate,
        netEarningsRate,
        availableBalance: Number(host.walletBalance),
        activeCompetitionsCount: activeRaffles.length,
        totalCompetitionsCount: hostRaffles.length,
        totalTicketsSold,
        totalWinnersCount,
      },
      earningsChart,
      activeRaffles: formattedActiveRaffles,
      upcomingDraws,
      recentActivity,
    };
  }

  async getHostSalesAnalytics(userId: string, timeRange: '7D' | '30D' | '1Y' = '7D') {
    const host = await this.getHostProfileByUserId(userId);
    const activeSub = await this.getHostActiveSubscription(host.id);
    const isPaidPlan = this.isProOrPremium(activeSub);
    const feeRate = isPaidPlan ? 0.10 : 0.15;
    const platformFeeRate = isPaidPlan ? 10 : 15;
    const netEarningsRate = isPaidPlan ? 90 : 85;

    // Fetch all host raffles
    const hostRaffles = await this.prisma.raffle.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tickets: true, winners: true },
        },
      },
    });

    const totalTicketsSold = hostRaffles.reduce((sum, r) => sum + r.ticketsSold, 0);
    const totalGrossRevenue = Number(
      hostRaffles.reduce(
        (sum, r) => sum + Number(r.pricePerTicket) * r.ticketsSold,
        0,
      ).toFixed(2),
    );
    const totalNetRevenue = Number((totalGrossRevenue * (1 - feeRate)).toFixed(2));
    const activeRaffles = hostRaffles.filter((r) => r.status === 'ACTIVE');

    // Unique entrants across host's raffles
    const uniqueEntrants = await this.prisma.ticket.groupBy({
      by: ['userId'],
      where: { raffle: { hostId: host.id } },
    });
    const totalEntrantsCount = uniqueEntrants.length;

    // Fetch tickets for this host within the time range
    const now = new Date();
    let startDate = new Date();
    if (timeRange === '7D') {
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === '30D') {
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === '1Y') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    }

    const hostTickets = await this.prisma.ticket.findMany({
      where: {
        raffle: { hostId: host.id },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        raffle: { select: { pricePerTicket: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Generate chart data points based on timeRange
    const chartData: Array<{ date: string; revenue: number; sales: number }> = [];

    if (timeRange === '7D') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        const bucketTickets = hostTickets.filter(
          (t) => t.createdAt >= dayStart && t.createdAt <= dayEnd,
        );
        const dayGross = bucketTickets.reduce(
          (sum, t) => sum + Number(t.raffle?.pricePerTicket || 0),
          0,
        );

        chartData.push({
          date: dayNames[d.getDay()],
          revenue: Number(dayGross.toFixed(2)),
          sales: bucketTickets.length,
        });
      }
    } else if (timeRange === '30D') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const dStart = new Date(now);
        dStart.setDate(dStart.getDate() - (i + 1) * 5);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - i * 5);
        dEnd.setHours(23, 59, 59, 999);

        const bucketTickets = hostTickets.filter(
          (t) => t.createdAt >= dStart && t.createdAt <= dEnd,
        );
        const bucketGross = bucketTickets.reduce(
          (sum, t) => sum + Number(t.raffle?.pricePerTicket || 0),
          0,
        );

        chartData.push({
          date: `${dEnd.getDate()} ${monthNames[dEnd.getMonth()]}`,
          revenue: Number(bucketGross.toFixed(2)),
          sales: bucketTickets.length,
        });
      }
    } else if (timeRange === '1Y') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

        const bucketTickets = hostTickets.filter(
          (t) => t.createdAt >= startOfMonth && t.createdAt <= endOfMonth,
        );
        const bucketGross = bucketTickets.reduce(
          (sum, t) => sum + Number(t.raffle?.pricePerTicket || 0),
          0,
        );

        chartData.push({
          date: monthNames[d.getMonth()],
          revenue: Number(bucketGross.toFixed(2)),
          sales: bucketTickets.length,
        });
      }
    }

    // Map competition list
    const breakdownRaffles = hostRaffles.map((r) => {
      const price = Number(r.pricePerTicket);
      const gross = Number((price * r.ticketsSold).toFixed(2));
      const net = Number((gross * (1 - feeRate)).toFixed(2));

      let status = 'Draft';
      if (r.status === 'ACTIVE') status = 'Live';
      else if (r.status === 'COMPLETED' || r.status === 'ENDED') status = 'Completed';
      else if (r.status === 'PENDING_APPROVAL') status = 'Pending Review';

      return {
        id: r.id,
        name: r.title,
        slug: r.slug || r.id,
        image: r.mainImage || null,
        status,
        ticketsSold: r.ticketsSold,
        totalTickets: r.totalTickets,
        ticketPrice: price,
        grossRevenue: gross,
        netRevenue: net,
        createdAt: r.createdAt,
      };
    });

    const metrics = [
      {
        id: 'total_revenue',
        label: 'Total Revenue',
        value: `£${totalGrossRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${platformFeeRate}% Platform Fee`,
        trend: 'up' as const,
      },
      {
        id: 'total_tickets_sold',
        label: 'Tickets Sold',
        value: totalTicketsSold.toLocaleString(),
        change: `${totalEntrantsCount} Entrants`,
        trend: 'up' as const,
      },
      {
        id: 'net_earnings',
        label: 'Net Earnings',
        value: `£${totalNetRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${netEarningsRate}% Net Share`,
        trend: 'up' as const,
      },
      {
        id: 'active_competitions',
        label: 'Active Competitions',
        value: activeRaffles.length.toString(),
        change: `${hostRaffles.length} Total Draws`,
        trend: 'up' as const,
      },
    ];

    return {
      metrics,
      chartData,
      raffles: breakdownRaffles,
    };
  }

  async getHostPerformanceAnalytics(
    userId: string,
    timeframe: '7D' | '1M' | '3M' | '1Y' = '1M',
  ) {
    const host = await this.getHostProfileByUserId(userId);

    // 1. Fetch host's raffles
    const hostRaffles = await this.prisma.raffle.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    // 2. Revenue Trend over timeframe
    const now = new Date();
    let startDate = new Date();
    if (timeframe === '7D') {
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === '1M') {
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === '3M') {
      startDate.setDate(now.getDate() - 89);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === '1Y') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    }

    const hostTickets = await this.prisma.ticket.findMany({
      where: {
        raffle: { hostId: host.id },
        createdAt: { gte: startDate },
      },
      include: {
        raffle: { select: { pricePerTicket: true, category: true } },
        user: { select: { location: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const revenueTrend: Array<{ month: string; revenue: number }> = [];

    if (timeframe === '7D') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        const bucket = hostTickets.filter((t) => t.createdAt >= dayStart && t.createdAt <= dayEnd);
        const gross = bucket.reduce((sum, t) => sum + Number(t.raffle?.pricePerTicket || 0), 0);
        revenueTrend.push({
          month: dayNames[d.getDay()],
          revenue: Number(gross.toFixed(2)),
        });
      }
    } else if (timeframe === '1M') {
      // 6 intervals of 5 days
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const dStart = new Date(now);
        dStart.setDate(dStart.getDate() - (i + 1) * 5);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - i * 5);
        dEnd.setHours(23, 59, 59, 999);

        const bucket = hostTickets.filter((t) => t.createdAt >= dStart && t.createdAt <= dEnd);
        const gross = bucket.reduce((sum, t) => sum + Number(t.raffle?.pricePerTicket || 0), 0);
        revenueTrend.push({
          month: `${dEnd.getDate()} ${monthNames[dEnd.getMonth()]}`,
          revenue: Number(gross.toFixed(2)),
        });
      }
    } else if (timeframe === '3M') {
      // 6 intervals of 15 days
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const dStart = new Date(now);
        dStart.setDate(dStart.getDate() - (i + 1) * 15);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(now);
        dEnd.setDate(dEnd.getDate() - i * 15);
        dEnd.setHours(23, 59, 59, 999);

        const bucket = hostTickets.filter((t) => t.createdAt >= dStart && t.createdAt <= dEnd);
        const gross = bucket.reduce((sum, t) => sum + Number(t.raffle?.pricePerTicket || 0), 0);
        revenueTrend.push({
          month: `${dEnd.getDate()} ${monthNames[dEnd.getMonth()]}`,
          revenue: Number(gross.toFixed(2)),
        });
      }
    } else if (timeframe === '1Y') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

        const bucket = hostTickets.filter((t) => t.createdAt >= startOfMonth && t.createdAt <= endOfMonth);
        const gross = bucket.reduce((sum, t) => sum + Number(t.raffle?.pricePerTicket || 0), 0);
        revenueTrend.push({
          month: monthNames[d.getMonth()],
          revenue: Number(gross.toFixed(2)),
        });
      }
    }

    // 3. Category Sales Distribution
    const categoryPalette = ['#8cb34a', '#a0d056', '#5a752a', '#72943a', '#445922', '#384719'];
    const categoryCounts = new Map<string, number>();

    const hasTickets = hostTickets.length > 0;
    if (hasTickets) {
      hostTickets.forEach((t) => {
        const cat = t.raffle?.category || 'General';
        categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
      });
    } else {
      hostRaffles.forEach((r) => {
        const cat = r.category || 'General';
        categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
      });
    }

    const totalCategoryVolume = Array.from(categoryCounts.values()).reduce((a, b) => a + b, 0);
    const categorySales = Array.from(categoryCounts.entries()).map(([name, count], index) => {
      const percentage = totalCategoryVolume > 0 ? Math.round((count / totalCategoryVolume) * 100) : 0;
      return {
        name,
        value: count,
        percentage,
        color: categoryPalette[index % categoryPalette.length],
      };
    });

    // 4. Top Performing Raffles
    const sortedRaffles = [...hostRaffles].sort((a, b) => {
      const pctA = a.totalTickets > 0 ? a.ticketsSold / a.totalTickets : 0;
      const pctB = b.totalTickets > 0 ? b.ticketsSold / b.totalTickets : 0;
      return b.ticketsSold - a.ticketsSold || pctB - pctA;
    });

    const topRaffles = sortedRaffles.slice(0, 5).map((r) => ({
      id: r.id,
      name: r.title,
      percentage: r.totalTickets > 0 ? Math.round((r.ticketsSold / r.totalTickets) * 100) : 0,
      ticketsSold: r.ticketsSold,
      totalTickets: r.totalTickets,
      revenue: Number(r.pricePerTicket) * r.ticketsSold,
    }));

    // 5. Entrant Demographics (User locations)
    const locationCounts = new Map<string, number>();
    const allEntrantTickets = await this.prisma.ticket.findMany({
      where: { raffle: { hostId: host.id } },
      select: { user: { select: { location: true } } },
    });

    allEntrantTickets.forEach((t) => {
      let loc = (t.user?.location || '').trim();
      if (!loc) loc = 'Other';
      else if (/england|london|birmingham|manchester|liverpool/i.test(loc)) loc = 'England';
      else if (/scotland|edinburgh|glasgow/i.test(loc)) loc = 'Scotland';
      else if (/wales|cardiff|swansea/i.test(loc)) loc = 'Wales';
      else if (/ireland|dublin|belfast/i.test(loc)) loc = 'Ireland';
      else if (/united states|usa|us/i.test(loc)) loc = 'United States';
      else if (/united kingdom|uk/i.test(loc)) loc = 'United Kingdom';
      else loc = 'Other';

      locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);
    });

    const totalEntrants = allEntrantTickets.length;
    let demographics: Array<{ region: string; percentage: number }> = [];

    if (totalEntrants > 0) {
      demographics = Array.from(locationCounts.entries())
        .map(([region, count]) => ({
          region,
          percentage: Math.round((count / totalEntrants) * 100),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
    }

    return {
      revenueTrend,
      categorySales,
      topRaffles,
      demographics,
    };
  }
}
