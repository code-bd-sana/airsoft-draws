import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(
    page = 1,
    limit = 10,
    search = '',
    role = '',
    status = 'All',
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
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

    if (status === 'Active') {
      where.isBlocked = false;
    } else if (status === 'Blocked') {
      where.isBlocked = true;
    }

    const normalizedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    if (sortBy === 'spent') {
      const conditions: Prisma.Sql[] = [];

      if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(
          Prisma.sql`(u.email ILIKE ${searchPattern} OR u.first_name ILIKE ${searchPattern} OR u.last_name ILIKE ${searchPattern})`,
        );
      }

      if (role) {
        conditions.push(Prisma.sql`u.role = ${role}`);
      }

      if (status === 'Active') {
        conditions.push(Prisma.sql`u.is_blocked = false`);
      } else if (status === 'Blocked') {
        conditions.push(Prisma.sql`u.is_blocked = true`);
      }

      const whereClause =
        conditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
          : Prisma.empty;

      const orderDirection =
        normalizedSortOrder === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;

      const [rankedUserIds, total] = await Promise.all([
        this.prisma.$queryRaw<{ id: string }[]>`
          SELECT u.id
          FROM users u
          LEFT JOIN transactions tr ON tr.user_id = u.id AND tr.status = 'COMPLETED' AND tr.type = 'TICKET_PURCHASE'
          ${whereClause}
          GROUP BY u.id, u.created_at
          ORDER BY COALESCE(SUM(tr.amount), 0) ${orderDirection}, u.created_at DESC
          LIMIT ${limit} OFFSET ${skip}
        `,
        this.prisma.user.count({ where }),
      ]);

      if (rankedUserIds.length === 0) {
        return {
          users: [],
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      }

      const ids = rankedUserIds.map((r) => r.id);

      const users = await this.prisma.user.findMany({
        where: { id: { in: ids } },
        include: {
          _count: {
            select: { tickets: true },
          },
          transactions: {
            where: { status: 'COMPLETED', type: 'TICKET_PURCHASE' },
            select: { amount: true },
          },
        },
      });

      const userMap = new Map(users.map((u) => [u.id, u]));
      const orderedUsers = ids
        .map((id) => userMap.get(id))
        .filter((u): u is (typeof users)[0] => !!u);

      const formattedUsers = orderedUsers.map((user) => {
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

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'tickets') {
      orderBy = [
        { tickets: { _count: normalizedSortOrder } },
        { createdAt: 'desc' },
      ];
    } else if (sortBy === 'name') {
      orderBy = [
        { firstName: normalizedSortOrder },
        { lastName: normalizedSortOrder },
      ];
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: normalizedSortOrder };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
