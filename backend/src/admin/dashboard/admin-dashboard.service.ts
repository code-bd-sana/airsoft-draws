import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

    async getOverviewStats() {
    const now = new Date();
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

    // Calculate fixed 6-month growth data
    const growthStartDate = new Date();
    growthStartDate.setMonth(now.getMonth() - 6);

    const chartUsers = await this.prisma.user.findMany({
      where: { createdAt: { gte: growthStartDate } },
      select: { createdAt: true }
    });
    const chartHosts = await this.prisma.hostProfile.findMany({
      where: { createdAt: { gte: growthStartDate } },
      select: { createdAt: true }
    });

    const usersMap = new Map<string, number>();
    const hostsMap = new Map<string, number>();

    const getMonthKey = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short' });

    const currentMonth = new Date(growthStartDate);
    while (currentMonth <= now) {
      const k = getMonthKey(currentMonth);
      if (!usersMap.has(k)) usersMap.set(k, 0);
      if (!hostsMap.has(k)) hostsMap.set(k, 0);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      currentMonth.setDate(1);
    }

    chartUsers.forEach(u => {
      const k = getMonthKey(u.createdAt);
      if (usersMap.has(k)) usersMap.set(k, usersMap.get(k)! + 1);
    });
    chartHosts.forEach(h => {
      const k = getMonthKey(h.createdAt);
      if (hostsMap.has(k)) hostsMap.set(k, hostsMap.get(k)! + 1);
    });

    const growthData = Array.from(usersMap.entries()).map(([name, usersCount]) => ({
      name,
      Users: usersCount,
      Hosts: hostsMap.get(name) || 0
    }));

    // Default 1Y revenue stats
    const defaultRevenue = await this.getRevenueStats('1Y');

    // Real verified top hosts
    const verifiedHosts = await this.prisma.hostProfile.findMany({
      where: { isVerified: true, user: { isBlocked: false } },
      take: 5,
      include: {
        raffles: {
          include: {
            tickets: {
              where: {
                transaction: { status: 'COMPLETED' }
              },
              include: {
                transaction: true
              }
            }
          }
        }
      }
    });

    const topHosts = verifiedHosts.map((h, i) => {
      let hostRev = 0;
      h.raffles?.forEach((r) => {
        r.tickets?.forEach((t) => {
          if (t.transaction) {
            hostRev += Number(t.transaction.amount) || 0;
          }
        });
      });
      return {
        rank: i + 1,
        name: h.businessName,
        revenue: `£${hostRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        initials: h.businessName.substring(0, 2).toUpperCase(),
        numericRevenue: hostRev,
      };
    }).sort((a, b) => b.numericRevenue - a.numericRevenue)
      .map((h, idx) => ({
        rank: idx + 1,
        name: h.name,
        revenue: h.revenue,
        initials: h.initials,
      }));

    return {
      topHosts,
      revenueData: defaultRevenue.revenueData,
      periodRevenue: defaultRevenue.periodRevenue,
      growthData,
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

  async getRevenueStats(period: string = '1Y') {
    const now = new Date();
    let startDate = new Date();
    if (period === '7D') startDate.setDate(now.getDate() - 7);
    else if (period === '1M') startDate.setMonth(now.getMonth() - 1);
    else if (period === '6M') startDate.setMonth(now.getMonth() - 6);
    else startDate.setFullYear(now.getFullYear() - 1);

    const chartTransactions = await this.prisma.transaction.findMany({
      where: { status: 'COMPLETED', type: 'TICKET_PURCHASE', createdAt: { gte: startDate } },
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const groupBy = (period === '7D' || period === '1M') ? 'day' : 'month';
    const revenueMap = new Map<string, number>();

    const getKey = (d: Date) => {
      if (groupBy === 'day') return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
    };

    const current = new Date(startDate);
    while (current <= now) {
      const k = getKey(current);
      if (!revenueMap.has(k)) revenueMap.set(k, 0);
      
      if (groupBy === 'day') current.setDate(current.getDate() + 1);
      else {
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
      }
    }

    let periodRevenue = 0;
    chartTransactions.forEach(t => {
      const k = getKey(t.createdAt);
      const amt = Number(t.amount) || 0;
      periodRevenue += amt;
      if (revenueMap.has(k)) {
        revenueMap.set(k, revenueMap.get(k)! + amt);
      } else {
        revenueMap.set(k, amt);
      }
    });

    const revenueData = Array.from(revenueMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      periodRevenue,
      revenueData,
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

  async getSystemLogs(params: { page?: number; limit?: number; search?: string; filter?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = params.search?.toLowerCase() || '';
    const filter = params.filter || 'All';

    // Query collections
    const [users, hosts, raffles, transactions, withdrawals] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.hostProfile.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.raffle.findMany({
        include: { host: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.transaction.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.withdrawal.findMany({
        include: { host: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const logs: any[] = [];

    // Map Users to Logs
    users.forEach((u) => {
      logs.push({
        id: `usr-${u.id}`,
        timestamp: u.createdAt,
        actor: {
          name: u.email,
          initials: u.email.substring(0, 2).toUpperCase(),
          type: u.role === 'ADMIN' ? 'admin' : 'user',
        },
        description: `User account created: ${u.email}`,
        ip: '127.0.0.1',
        status: 'Success',
      });

      if (u.isBlocked) {
        logs.push({
          id: `usr-blocked-${u.id}`,
          timestamp: u.updatedAt || u.createdAt,
          actor: {
            name: 'System',
            initials: 'SY',
            type: 'system',
          },
          description: `User account suspended: ${u.email}`,
          ip: '—',
          status: 'Success',
        });
      }
    });

    // Map Hosts to Logs
    hosts.forEach((h) => {
      logs.push({
        id: `hst-${h.id}`,
        timestamp: h.createdAt,
        actor: {
          name: h.user?.email || 'New Host',
          initials: h.businessName.substring(0, 2).toUpperCase(),
          type: 'user',
        },
        description: `Host profile registered: ${h.businessName}`,
        ip: '127.0.0.1',
        status: 'Success',
      });
    });

    // Map Raffles to Logs
    raffles.forEach((r) => {
      logs.push({
        id: `raf-${r.id}`,
        timestamp: r.createdAt,
        actor: {
          name: r.host?.businessName || 'Host',
          initials: r.title.substring(0, 2).toUpperCase(),
          type: 'user',
        },
        description: `Raffle created: '${r.title}' (Status: ${r.status})`,
        ip: '127.0.0.1',
        status: 'Success',
      });

      if (r.status === 'ACTIVE') {
        logs.push({
          id: `raf-approved-${r.id}`,
          timestamp: r.updatedAt || r.createdAt,
          actor: {
            name: 'Admin',
            initials: 'AD',
            type: 'admin',
          },
          description: `Raffle approved & published: '${r.title}'`,
          ip: '127.0.0.1',
          status: 'Success',
        });
      }
    });

    // Map Transactions to Logs
    transactions.forEach((t) => {
      const isRefund = t.type === 'REFUND';
      logs.push({
        id: `tx-${t.id}`,
        timestamp: t.createdAt,
        actor: {
          name: t.user?.email || 'Customer',
          initials: 'TX',
          type: isRefund ? 'admin' : 'user',
        },
        description: isRefund
          ? `Refund processed for transaction: £${Number(t.amount).toFixed(2)}`
          : `Ticket purchased successfully: £${Number(t.amount).toFixed(2)}`,
        ip: '127.0.0.1',
        status: t.status === 'COMPLETED' ? 'Success' : 'Failed',
      });
    });

    // Map Withdrawals to Logs
    withdrawals.forEach((w) => {
      logs.push({
        id: `wd-${w.id}`,
        timestamp: w.createdAt,
        actor: {
          name: w.host?.businessName || 'Host',
          initials: 'WD',
          type: 'user',
        },
        description: `Withdrawal request submitted: £${Number(w.amount).toFixed(2)}`,
        ip: '127.0.0.1',
        status: 'Success',
      });

      if (w.status === 'COMPLETED' || w.status === 'REJECTED') {
        logs.push({
          id: `wd-status-${w.id}`,
          timestamp: w.updatedAt || w.createdAt,
          actor: {
            name: 'Admin',
            initials: 'AD',
            type: 'admin',
          },
          description: `Withdrawal request ${w.status.toLowerCase()}: £${Number(w.amount).toFixed(2)}`,
          ip: '127.0.0.1',
          status: 'Success',
        });
      }
    });

    // Filter list
    let filteredLogs = logs;

    if (search) {
      filteredLogs = filteredLogs.filter(
        (l) =>
          l.description.toLowerCase().includes(search) ||
          l.actor.name.toLowerCase().includes(search)
      );
    }

    if (filter !== 'All') {
      if (filter === 'User Actions') {
        filteredLogs = filteredLogs.filter((l) => l.actor.type === 'user');
      } else if (filter === 'Admin Actions') {
        filteredLogs = filteredLogs.filter((l) => l.actor.type === 'admin');
      } else if (filter === 'System Events') {
        filteredLogs = filteredLogs.filter((l) => l.actor.type === 'system');
      } else if (filter === 'Errors') {
        filteredLogs = filteredLogs.filter((l) => l.status === 'Failed');
      }
    }

    // Sort by timestamp desc
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Paginate
    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filteredLogs.slice((page - 1) * limit, page * limit);

    return {
      logs: paginated.map((l) => ({
        ...l,
        timestamp: l.timestamp.toISOString(),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
  async getReportsAnalytics(timeFilter: string = '3M') {
    const now = new Date();
    let startDate = new Date();
    if (timeFilter === '7D') startDate.setDate(now.getDate() - 7);
    else if (timeFilter === '1M') startDate.setMonth(now.getMonth() - 1);
    else if (timeFilter === '1Y') startDate.setFullYear(now.getFullYear() - 1);
    else startDate.setMonth(now.getMonth() - 3); // default 3M

    // 1. Revenue Trend
    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: 'COMPLETED',
        type: 'TICKET_PURCHASE',
        createdAt: { gte: startDate },
      },
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const isDayGroup = timeFilter === '7D' || timeFilter === '1M';
    const revenueMap = new Map<string, number>();

    const getKey = (d: Date) => {
      if (isDayGroup) return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return d.toLocaleDateString('en-GB', { month: 'short' });
    };

    const cur = new Date(startDate);
    while (cur <= now) {
      const k = getKey(cur);
      if (!revenueMap.has(k)) revenueMap.set(k, 0);
      if (isDayGroup) cur.setDate(cur.getDate() + 1);
      else {
        cur.setMonth(cur.getMonth() + 1);
        cur.setDate(1);
      }
    }

    transactions.forEach((t) => {
      const k = getKey(t.createdAt);
      if (revenueMap.has(k)) {
        revenueMap.set(k, revenueMap.get(k)! + (Number(t.amount) || 0));
      } else {
        revenueMap.set(k, Number(t.amount) || 0);
      }
    });

    const revenueTrend = Array.from(revenueMap.entries()).map(([name, value]) => ({ name, value }));

    // 2. Sales by Category
    const categoryColors = ['#A0D056', '#72943A', '#8CB34A', '#C0E868', '#43581E', '#2D3C13'];
    const raffles = await this.prisma.raffle.findMany({
      select: { category: true, ticketsSold: true },
    });

    const categoryCounts = new Map<string, number>();
    let totalCatCount = 0;
    raffles.forEach((r) => {
      const cat = r.category?.trim() || 'General';
      const weight = (r.ticketsSold && r.ticketsSold > 0) ? r.ticketsSold : 1;
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + weight);
      totalCatCount += weight;
    });

    const salesByCategory = Array.from(categoryCounts.entries())
      .map(([name, count], idx) => ({
        name,
        value: totalCatCount > 0 ? Math.round((count / totalCatCount) * 100) : 0,
        count,
        color: categoryColors[idx % categoryColors.length],
      }))
      .sort((a, b) => b.value - a.value);

    // 3. Most Popular Competitions
    const popularRaffles = await this.prisma.raffle.findMany({
      take: 5,
      orderBy: [{ ticketsSold: 'desc' }, { createdAt: 'desc' }],
      select: { title: true, ticketsSold: true, totalTickets: true },
    });

    const maxPopularVal = Math.max(1, ...popularRaffles.map((r) => r.ticketsSold || 0), 10);
    const popularCompetitions = popularRaffles.map((r) => ({
      name: r.title,
      value: r.ticketsSold || 0,
      totalTickets: r.totalTickets,
      maxValue: maxPopularVal,
    }));

    // 4. User Growth Over Time
    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const userMap = new Map<string, number>();
    const userCur = new Date(startDate);
    while (userCur <= now) {
      const k = getKey(userCur);
      if (!userMap.has(k)) userMap.set(k, 0);
      if (isDayGroup) userCur.setDate(userCur.getDate() + 1);
      else {
        userCur.setMonth(userCur.getMonth() + 1);
        userCur.setDate(1);
      }
    }

    users.forEach((u) => {
      const k = getKey(u.createdAt);
      if (userMap.has(k)) userMap.set(k, userMap.get(k)! + 1);
      else userMap.set(k, 1);
    });

    const userGrowth = Array.from(userMap.entries()).map(([name, users]) => ({ name, users }));

    // 5. Host Performance
    const hosts = await this.prisma.hostProfile.findMany({
      where: { isVerified: true },
      take: 5,
      include: { raffles: { select: { status: true, ticketsSold: true, totalTickets: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const hostPerformance = hosts.map((h) => {
      const totalRaffles = h.raffles.length;
      const activeRaffles = h.raffles.filter((r) => r.status === 'ACTIVE').length;
      let totalSold = 0;
      let totalCapacity = 0;
      h.raffles.forEach((r) => {
        totalSold += r.ticketsSold || 0;
        totalCapacity += r.totalTickets || 0;
      });

      let percent = 0;
      if (totalCapacity > 0 && totalSold > 0) {
        percent = Math.min(100, Math.round((totalSold / totalCapacity) * 100));
      } else if (totalRaffles > 0) {
        percent = Math.min(100, Math.round((activeRaffles / totalRaffles) * 100)) || 50;
      }

      return {
        name: h.businessName || 'Host',
        percent,
        rafflesCount: totalRaffles,
      };
    });

    // 6. Geographic Entry Distribution
    const allUsers = await this.prisma.user.findMany({
      select: { location: true },
    });

    const geoMap = new Map<string, number>();
    allUsers.forEach((u) => {
      const loc = u.location?.toLowerCase().trim() || '';
      let region = 'Other';
      if (loc.includes('england') || loc.includes('london') || loc.includes('suffolk') || loc.includes('wolverhampton') || loc.includes('southampton') || loc.includes('amesbury') || loc.includes('manston') || loc.includes('tamworth') || loc.includes('marlow') || loc.includes('newcastle')) {
        region = 'England';
      } else if (loc.includes('scotland')) {
        region = 'Scotland';
      } else if (loc.includes('wales')) {
        region = 'Wales';
      } else if (loc.includes('ireland')) {
        region = 'Ireland';
      } else if (loc.includes('united kingdom') || loc.includes('uk')) {
        region = 'United Kingdom';
      } else if (loc.includes('united states') || loc.includes('us')) {
        region = 'United States';
      } else if (loc.includes('germany')) {
        region = 'Germany';
      }

      geoMap.set(region, (geoMap.get(region) || 0) + 1);
    });

    const totalGeo = allUsers.length || 1;
    const geographicData = Array.from(geoMap.entries())
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalGeo) * 100),
        count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      revenueTrend,
      salesByCategory,
      popularCompetitions,
      userGrowth,
      hostPerformance,
      geographicData,
    };
  }
}
