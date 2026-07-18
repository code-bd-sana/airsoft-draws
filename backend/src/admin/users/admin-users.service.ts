import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(page = 1, limit = 10, search = '', role = '') {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tickets: true },
          },
          transactions: {
            where: { status: 'COMPLETED', type: 'TICKET_PURCHASE' },
            select: { amount: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => {
      const totalSpent = user.transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        location: user.location,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        ticketsCount: user._count.tickets,
        totalSpent,
      };
    });

    return {
      users: formattedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalUsers, newThisMonth, activeUsers, blockedUsers] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        this.prisma.user.count({
          where: { isBlocked: false },
        }),
        this.prisma.user.count({
          where: { isBlocked: true },
        }),
      ]);

    // Active percentage calculation
    const activePercentage =
      totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0.0';
    // Blocked percentage calculation
    const blockedPercentage =
      totalUsers > 0 ? ((blockedUsers / totalUsers) * 100).toFixed(1) : '0.0';

    return {
      totalUsers,
      newThisMonth,
      activeUsers,
      blockedUsers,
      activePercentage,
      blockedPercentage,
    };
  }

  async toggleBlockStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: !user.isBlocked },
      select: { id: true, email: true, isBlocked: true },
    });

    return updatedUser;
  }
}
