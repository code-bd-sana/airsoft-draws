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
      where.isVerified = true;
      where.user = { isBlocked: false };
    } else if (status === 'Blocked') {
      where.user = { isBlocked: true };
    } else if (status === 'Pending') {
      where.isVerified = false;
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
              firstName: true,
              lastName: true,
              avatarUrl: true,
              phone: true,
              address: true,
              location: true,
              isBlocked: true,
              isEmailVerified: true,
              createdAt: true,
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
        firstName: host.user.firstName,
        lastName: host.user.lastName,
        avatarUrl: host.user.avatarUrl,
        logoUrl: host.logoUrl || host.user.avatarUrl,
        bannerUrl: host.bannerUrl,
        bio: host.bio,
        phone: host.phone || host.user.phone,
        address: host.address || host.user.address || host.user.location,
        slug: host.slug,
        vatNumber: host.vatNumber,
        bankAccountName: host.bankAccountName,
        sortCode: host.sortCode,
        accountNumber: host.accountNumber,
        isBlocked: host.user.isBlocked,
        isVerified: host.isVerified,
        isEmailVerified: host.user.isEmailVerified,
        plan: !host.isVerified ? 'Pending Approval' : activePlan,
        raffles: host._count.raffles,
        revenue: revenue,
        walletBalance: Number(host.walletBalance) || 0,
        createdAt: host.createdAt,
        userCreatedAt: host.user.createdAt,
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
    const [totalHosts, activeHosts, blockedHosts, pendingHosts] = await Promise.all([
      this.prisma.hostProfile.count(),
      this.prisma.hostProfile.count({ where: { isVerified: true, user: { isBlocked: false } } }),
      this.prisma.hostProfile.count({ where: { user: { isBlocked: true } } }),
      this.prisma.hostProfile.count({ where: { isVerified: false } }),
    ]);

    return {
      totalHosts,
      activeHosts,
      blockedHosts,
      pendingHosts,
    };
  }

  async approveHost(id: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { id },
    });
    if (!hostProfile) {
      throw new NotFoundException('Host profile not found');
    }

    return this.prisma.hostProfile.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  async rejectHost(id: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { id },
    });
    if (!hostProfile) {
      throw new NotFoundException('Host profile not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete subscriptions if any exist
      await tx.hostSubscription.deleteMany({
        where: { hostId: id },
      });
      // Delete host profile
      await tx.hostProfile.delete({
        where: { id },
      });
      // Reset user role to CLIENT
      await tx.user.update({
        where: { id: hostProfile.userId },
        data: { role: 'CLIENT' },
      });
    });
  }

  async getHostById(id: string) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
            address: true,
            location: true,
            isBlocked: true,
            isEmailVerified: true,
            createdAt: true,
          },
        },
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
        },
        raffles: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            ticketsSold: true,
            totalTickets: true,
            pricePerTicket: true,
            createdAt: true,
          },
        },
        _count: {
          select: { raffles: true, withdrawals: true },
        },
      },
    });

    if (!host) {
      throw new NotFoundException('Host profile not found');
    }

    const activeSubscription = host.subscriptions.find((s) => s.status === 'ACTIVE');
    const planName = activeSubscription ? activeSubscription.plan.name : 'Free';

    return {
      id: host.id,
      userId: host.userId,
      businessName: host.businessName,
      email: host.user.email,
      firstName: host.user.firstName,
      lastName: host.user.lastName,
      avatarUrl: host.user.avatarUrl,
      logoUrl: host.logoUrl || host.user.avatarUrl,
      bannerUrl: host.bannerUrl,
      bio: host.bio,
      phone: host.phone || host.user.phone,
      address: host.address || host.user.address || host.user.location,
      slug: host.slug,
      vatNumber: host.vatNumber,
      bankAccountName: host.bankAccountName,
      sortCode: host.sortCode,
      accountNumber: host.accountNumber,
      walletBalance: Number(host.walletBalance) || 0,
      isBlocked: host.user.isBlocked,
      isVerified: host.isVerified,
      isEmailVerified: host.user.isEmailVerified,
      plan: !host.isVerified ? 'Pending Approval' : planName,
      totalCompetitions: host._count.raffles,
      recentCompetitions: host.raffles,
      subscriptions: host.subscriptions,
      createdAt: host.createdAt,
      userCreatedAt: host.user.createdAt,
    };
  }
}
