import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let mockService: {
    findAllForUser: jest.Mock;
    getUnreadCount: jest.Mock;
    markAsRead: jest.Mock;
    markAllAsRead: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      findAllForUser: jest.fn(),
      getUnreadCount: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockService },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should extract userId and delegate to findAllForUser', async () => {
      const mockReq = { user: { sub: 'u-123' } } as any;
      mockService.findAllForUser.mockResolvedValue({
        notifications: [],
        total: 0,
      });

      const query = { page: 1, limit: 15 };
      const result = await controller.getNotifications(mockReq, query);

      expect(mockService.findAllForUser).toHaveBeenCalledWith('u-123', query);
      expect(result).toEqual({ notifications: [], total: 0 });
    });

    it('should throw UnauthorizedException if req.user is missing', async () => {
      const mockReq = {} as any;
      await expect(
        controller.getNotifications(mockReq, {}),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for the user', async () => {
      const mockReq = { user: { sub: 'u-123' } } as any;
      mockService.getUnreadCount.mockResolvedValue({ count: 3 });

      const result = await controller.getUnreadCount(mockReq);

      expect(mockService.getUnreadCount).toHaveBeenCalledWith('u-123');
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read and return updated count', async () => {
      const mockReq = { user: { sub: 'u-123' } } as any;
      mockService.markAllAsRead.mockResolvedValue({ count: 5 });

      const result = await controller.markAllAsRead(mockReq);

      expect(mockService.markAllAsRead).toHaveBeenCalledWith('u-123');
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('markAsRead', () => {
    it('should mark individual notification as read', async () => {
      const mockReq = { user: { sub: 'u-123' } } as any;
      const updatedRecord = { id: 'n-1', isRead: true };
      mockService.markAsRead.mockResolvedValue(updatedRecord);

      const result = await controller.markAsRead(mockReq, 'n-1');

      expect(mockService.markAsRead).toHaveBeenCalledWith('u-123', 'n-1');
      expect(result).toEqual(updatedRecord);
    });
  });
});
