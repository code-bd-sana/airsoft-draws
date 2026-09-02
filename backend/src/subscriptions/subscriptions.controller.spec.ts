import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let mockSubscriptionsService: {
    getPlans: jest.Mock;
    getMySubscription: jest.Mock;
    getMyBillingHistory: jest.Mock;
    cancelSubscription: jest.Mock;
    getAllSubscriptions: jest.Mock;
    getAdminStats: jest.Mock;
    createSubscriptionRequest: jest.Mock;
    getMySubscriptionRequest: jest.Mock;
    getAllSubscriptionRequestsAdmin: jest.Mock;
    approveSubscriptionRequest: jest.Mock;
    rejectSubscriptionRequest: jest.Mock;
    assignSubscriptionManually: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionsService = {
      getPlans: jest.fn(),
      getMySubscription: jest.fn(),
      getMyBillingHistory: jest.fn(),
      cancelSubscription: jest.fn(),
      getAllSubscriptions: jest.fn(),
      getAdminStats: jest.fn(),
      createSubscriptionRequest: jest.fn(),
      getMySubscriptionRequest: jest.fn(),
      getAllSubscriptionRequestsAdmin: jest.fn(),
      approveSubscriptionRequest: jest.fn(),
      rejectSubscriptionRequest: jest.fn(),
      assignSubscriptionManually: jest.fn(),
    };
    mockJwtService = { verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlans', () => {
    it('should return plans', async () => {
      mockSubscriptionsService.getPlans.mockResolvedValue([{ id: 'p-1' }]);
      const result = await controller.getPlans();
      expect(result).toEqual([{ id: 'p-1' }]);
    });
  });

  describe('getMySubscription', () => {
    it('should throw UnauthorizedException if no cookie', async () => {
      const req = createMockRequest();
      await expect(controller.getMySubscription(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return current subscription', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockSubscriptionsService.getMySubscription.mockResolvedValue({ id: 'hs-1' });

      const result = await controller.getMySubscription(req);
      expect(mockSubscriptionsService.getMySubscription).toHaveBeenCalledWith('u-1');
      expect(result).toEqual({ id: 'hs-1' });
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockSubscriptionsService.cancelSubscription.mockResolvedValue({ status: 'CANCELLED' });

      const result = await controller.cancelSubscription(req);
      expect(mockSubscriptionsService.cancelSubscription).toHaveBeenCalledWith('u-1');
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('admin endpoints', () => {
    it('should get all subscriptions for admin', async () => {
      mockSubscriptionsService.getAllSubscriptions.mockResolvedValue([{ id: 'hs-1' }]);
      const result = await controller.getAllSubscriptions();
      expect(result).toEqual([{ id: 'hs-1' }]);
    });

    it('should get admin stats', async () => {
      mockSubscriptionsService.getAdminStats.mockResolvedValue({ mrr: 100 });
      const result = await controller.getAdminStats();
      expect(result).toEqual({ mrr: 100 });
    });

    it('should approve subscription request', async () => {
      mockSubscriptionsService.approveSubscriptionRequest.mockResolvedValue({ message: 'ok' });
      const result = await controller.approveSubscriptionRequest({
        requestId: 'sr-1',
        approvedDays: 30,
      });
      expect(mockSubscriptionsService.approveSubscriptionRequest).toHaveBeenCalledWith(
        'sr-1',
        30,
        undefined,
      );
      expect(result).toEqual({ message: 'ok' });
    });

    it('should reject subscription request', async () => {
      mockSubscriptionsService.rejectSubscriptionRequest.mockResolvedValue({ message: 'rejected' });
      const result = await controller.rejectSubscriptionRequest({
        requestId: 'sr-1',
        adminNotes: 'note',
      });
      expect(mockSubscriptionsService.rejectSubscriptionRequest).toHaveBeenCalledWith(
        'sr-1',
        'note',
      );
      expect(result).toEqual({ message: 'rejected' });
    });

    it('should assign subscription manually', async () => {
      mockSubscriptionsService.assignSubscriptionManually.mockResolvedValue({ message: 'assigned' });
      const result = await controller.assignSubscriptionManually({
        hostProfileId: 'hp-1',
        planId: 'p-1',
        durationDays: 45,
      });
      expect(mockSubscriptionsService.assignSubscriptionManually).toHaveBeenCalledWith(
        'hp-1',
        'p-1',
        45,
        undefined,
      );
      expect(result).toEqual({ message: 'assigned' });
    });
  });
});
