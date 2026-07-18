import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats() {
    const [totalUsers, activeHosts, liveRaffles, revenueAggregate, awaitingReviewCount, awaitingReviewList] = await Promise.all([
      // Total users count
      this.prisma.user.count(),
      // Active verified unblocked hosts count
      this.prisma.hostProfile.count({
        where: { isVerified: true, user: { isBlocked: false } },
      }),
      // Live active raffles count
      this.prisma.raffle.count({
        where: { status: 'ACTIVE' },
      }),
      // Total platform revenue sum
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED', type: 'TICKET_PURCHASE' },
        _sum: { amount: true },
      }),
      // Count of raffles awaiting admin review
      this.prisma.raffle.count({
        where: { status: 'PENDING_APPROVAL' },
      }),
      // List of raffles awaiting review
      this.prisma.raffle.findMany({
        where: { status: 'PENDING_APPROVAL' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          host: {
            select: {
              businessName: true,
            },
          },
        },
      }),
    ]);

    const totalRevenue = Number(revenueAggregate._sum.amount) || 0;

    // Fetch dynamic feeds to construct Recent Activity timeline
    const [recentHosts, recentUsers, recentRaffles, recentWithdrawals, recentTransactions] = await Promise.all([
      this.prisma.hostProfile.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.raffle.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.withdrawal.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.findMany({
        where: { type: 'TICKET_PURCHASE' },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const activities = [
      ...recentHosts.map((h) => ({
        text: `New host registered — ${h.businessName}`,
        createdAt: h.createdAt,
        highlight: false,
        alert: false,
      })),
      ...recentUsers.map((u) => ({
        text: `New user registered — ${u.email}`,
        createdAt: u.createdAt,
        highlight: false,
        alert: false,
      })),
      ...recentRaffles.map((r) => ({
        text: r.status === 'ACTIVE' ? `Raffle approved — ${r.title}` : `New raffle submitted — ${r.title}`,
        createdAt: r.createdAt,
        highlight: false,
        alert: r.status === 'CANCELLED',
      })),
      ...recentWithdrawals.map((w) => ({
        text: `Withdrawal request — £${Number(w.amount).toFixed(2)} (${w.status})`,
        createdAt: w.createdAt,
        highlight: w.status === 'PENDING',
        alert: w.status === 'FAILED',
      })),
      ...recentTransactions.map((t) => ({
        text: `Ticket purchased — £${Number(t.amount).toFixed(2)}`,
        createdAt: t.createdAt,
        highlight: false,
        alert: false,
      })),
    ];

    // Sort all events by date descending and return top 5
    const recentActivity = activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((act) => ({
        text: act.text,
        time: this.formatRelativeTime(act.createdAt),
        highlight: act.highlight,
        alert: act.alert,
      }));

    return {
      stats: {
        totalUsers,
        activeHosts,
        liveRaffles,
        totalRevenue,
      },
      awaitingReview: {
        count: awaitingReviewCount,
        list: awaitingReviewList.map((raffle) => ({
          id: raffle.id,
          title: raffle.title,
          sub: `Submitted by ${raffle.host.businessName}`,
          icon: raffle.title.substring(0, 2).toUpperCase(),
        })),
      },
      recentActivity,
    };
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  }
}
