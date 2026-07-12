import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminHostsService {
  constructor(private prisma: PrismaService) {}

  async getHosts(page = 1, limit = 10, search = '', status = 'All') {
    const skip = (page - 1) * limit;

    const where: Prisma.HostProfileWhereInput = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status === 'Active') {
      where.user = { isBlocked: false };
    } else if (status === 'Blocked') {
      where.user = { isBlocked: true };
    }

    const [hosts, total] = await Promise.all([
      this.prisma.hostProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              isBlocked: true,
            },
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            include: { plan: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { raffles: true },
          },
        },
      }),
      this.prisma.hostProfile.count({ where }),
    ]);

    const formattedHosts = hosts.map((host) => {
      // For revenue, using walletBalance for simplicity right now
      const revenue = Number(host.walletBalance) || 0;

      const activePlan =
        host.subscriptions.length > 0
          ? host.subscriptions[0].plan.name
          : 'Free';

      return {
        id: host.id,
        userId: host.userId,
        businessName: host.businessName,
        email: host.user.email,
        isBlocked: host.user.isBlocked,
        plan: activePlan,
        raffles: host._count.raffles,
        revenue: revenue,
        createdAt: host.createdAt,
      };
    });

    return {
      hosts: formattedHosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const [totalHosts, activeHosts, blockedHosts] = await Promise.all([
      this.prisma.hostProfile.count(),
      this.prisma.hostProfile.count({ where: { user: { isBlocked: false } } }),
      this.prisma.hostProfile.count({ where: { user: { isBlocked: true } } }),
    ]);

    return {
      totalHosts,
      activeHosts,
      blockedHosts,
    };
  }
}
