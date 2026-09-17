import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  createMockPrismaService,
  MockPrismaService,
} from '../test-utils/prisma-mock';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllForUser', () => {
    it('should return paginated notifications with default parameters', async () => {
      const mockNotifications = [
        {
          id: 'n-1',
          userId: 'u-1',
          type: 'PAYMENT',
          title: 'Ticket Purchased',
          subtitle: 'You bought 2 tickets',
          link: '/dashboard/user/tickets',
          isRead: false,
          createdAt: new Date(),
        },
      ];

      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrisma.notification.count.mockResolvedValue(1);

      const result = await service.findAllForUser('u-1');

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'u-1' },
        skip: 0,
        take: 15,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.notifications).toEqual(mockNotifications);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(15);
      expect(result.totalPages).toBe(1);
    });

    it('should apply type and unreadOnly filters correctly', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);

      await service.findAllForUser('u-1', {
        page: 2,
        limit: 10,
        type: 'WIN',
        unreadOnly: true,
      });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'u-1',
          type: 'WIN',
          isRead: false,
        },
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      mockPrisma.notification.count.mockResolvedValue(4);

      const result = await service.getUnreadCount('u-1');
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'u-1', isRead: false },
      });
      expect(result).toEqual({ count: 4 });
    });
  });

  describe('markAsRead', () => {
    it('should throw NotFoundException if notification is not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('u-1', 'n-missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if notification belongs to another user', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        id: 'n-1',
        userId: 'u-other',
      });

      await expect(service.markAsRead('u-1', 'n-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return notification if owned by user', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        id: 'n-1',
        userId: 'u-1',
        isRead: false,
      });
      mockPrisma.notification.update.mockResolvedValue({
        id: 'n-1',
        userId: 'u-1',
        isRead: true,
      });

      const result = await service.markAsRead('u-1', 'n-1');
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'n-1' },
        data: { isRead: true },
      });
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read and return count', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead('u-1');
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u-1', isRead: false },
        data: { isRead: true },
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('createNotification', () => {
    it('should create and return a notification record', async () => {
      const createdNotification = {
        id: 'n-new',
        userId: 'u-1',
        type: 'PAYMENT',
        title: 'Payment Successful',
      };
      mockPrisma.notification.create.mockResolvedValue(createdNotification);

      const result = await service.createNotification({
        userId: 'u-1',
        type: 'PAYMENT',
        title: 'Payment Successful',
      });

      expect(mockPrisma.notification.create).toHaveBeenCalled();
      expect(result).toEqual(createdNotification);
    });

    it('should catch error, log and return null without throwing', async () => {
      mockPrisma.notification.create.mockRejectedValue(new Error('DB Error'));

      const result = await service.createNotification({
        userId: 'u-1',
        type: 'PAYMENT',
        title: 'Payment',
      });

      expect(result).toBeNull();
    });
  });

  describe('notifyAdmins', () => {
    it('should batch insert notifications for all admin users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);
      mockPrisma.notification.createMany.mockResolvedValue({ count: 2 });

      const result = await service.notifyAdmins({
        type: 'WITHDRAWAL',
        title: 'New Withdrawal Request',
        subtitle: 'Host requested payout',
        link: '/dashboard/admin/withdrawals',
      });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
        data: [
          {
            userId: 'admin-1',
            type: 'WITHDRAWAL',
            title: 'New Withdrawal Request',
            subtitle: 'Host requested payout',
            link: '/dashboard/admin/withdrawals',
            metadata: undefined,
          },
          {
            userId: 'admin-2',
            type: 'WITHDRAWAL',
            title: 'New Withdrawal Request',
            subtitle: 'Host requested payout',
            link: '/dashboard/admin/withdrawals',
            metadata: undefined,
          },
        ],
      });
      expect(result).toEqual({ count: 2 });
    });

    it('should return count 0 if no admins exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await service.notifyAdmins({
        type: 'WITHDRAWAL',
        title: 'New Withdrawal Request',
      });

      expect(result).toEqual({ count: 0 });
      expect(mockPrisma.notification.createMany).not.toHaveBeenCalled();
    });

    it('should catch error, log and return count 0 without throwing', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('DB failure'));

      const result = await service.notifyAdmins({
        type: 'WITHDRAWAL',
        title: 'New Withdrawal Request',
      });

      expect(result).toEqual({ count: 0 });
    });
  });
});
