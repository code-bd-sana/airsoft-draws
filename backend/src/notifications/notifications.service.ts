import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string, query: QueryNotificationsDto = {}) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 15;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (query.type && query.type.toUpperCase() !== 'ALL') {
      where.type = query.type.toUpperCase();
    }

    if (query.unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { count };
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { count: result.count };
  }

  async createNotification(data: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          subtitle: data.subtitle,
          link: data.link,
          metadata: data.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${data.userId}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async notifyAdmins(data: Omit<CreateNotificationDto, 'userId'>) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      if (!admins || admins.length === 0) {
        return { count: 0 };
      }

      const records = admins.map((admin) => ({
        userId: admin.id,
        type: data.type,
        title: data.title,
        subtitle: data.subtitle,
        link: data.link,
        metadata: data.metadata,
      }));

      const result = await this.prisma.notification.createMany({
        data: records,
      });

      return { count: result.count };
    } catch (error) {
      this.logger.error(
        `Failed to notify admins: ${error.message}`,
        error.stack,
      );
      return { count: 0 };
    }
  }
}
