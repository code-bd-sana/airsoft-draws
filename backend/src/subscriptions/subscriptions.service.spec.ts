import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    it('should return all plans ordered by price', async () => {
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue([
        { id: 'p-1', name: 'Free', price: '0.00' },
        { id: 'p-2', name: 'Premium', price: '29.00' },
      ]);

      const plans = await service.getPlans();
      expect(plans).toHaveLength(2);
      expect(mockPrisma.subscriptionPlan.findMany).toHaveBeenCalledWith({
        orderBy: { price: 'asc' },
      });
    });
  });

  describe('getMySubscription', () => {
    it('should return null if host profile not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      const result = await service.getMySubscription('u-1');
      expect(result).toBeNull();
    });

    it('should return subscription with transaction if found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1', userId: 'u-1' });
      mockPrisma.hostSubscription.findFirst.mockResolvedValue({
        id: 'hs-1',
        hostId: 'hp-1',
        status: 'ACTIVE',
      });
      mockPrisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        amount: '29.00',
      });

      const result = await service.getMySubscription('u-1');
      expect(result?.id).toBe('hs-1');
      expect(result?.transaction?.id).toBe('tx-1');
    });
  });

  describe('cancelSubscription', () => {
    it('should throw BadRequestException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      await expect(service.cancelSubscription('u-1')).rejects.toThrow(
        'Host profile not found',
      );
    });

    it('should throw BadRequestException if no active subscription', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.hostSubscription.findFirst.mockResolvedValue(null);

      await expect(service.cancelSubscription('u-1')).rejects.toThrow(
        'No active subscription found to cancel',
      );
    });

    it('should cancel active subscription', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.hostSubscription.findFirst.mockResolvedValue({ id: 'hs-1', status: 'ACTIVE' });
      mockPrisma.hostSubscription.update.mockResolvedValue({ id: 'hs-1', status: 'CANCELLED' });

      const result = await service.cancelSubscription('u-1');
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('getMyBillingHistory', () => {
    it('should return billing transactions for host', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([{ id: 'tx-1', amount: '29.00' }]);
      const history = await service.getMyBillingHistory('u-1');
      expect(history).toHaveLength(1);
    });
  });

  describe('getAdminStats', () => {
    it('should calculate MRR and plan distribution', async () => {
      mockPrisma.hostSubscription.findMany.mockResolvedValue([
        {
          id: 'hs-1',
          planId: 'p-1',
          plan: { name: 'Premium', price: '29.00' },
        },
        {
          id: 'hs-2',
          planId: 'p-2',
          plan: { name: 'Pro', price: '79.00' },
        },
      ]);

      const stats = await service.getAdminStats();
      expect(stats.mrr).toBe(108);
      expect(stats.totalActive).toBe(2);
      expect(stats.planDistribution).toHaveLength(2);
    });
  });

  describe('createSubscriptionRequest', () => {
    it('should throw BadRequestException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      await expect(
        service.createSubscriptionRequest('u-1', 'p-1'),
      ).rejects.toThrow('Host profile not found');
    });

    it('should throw BadRequestException if plan not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(null);

      await expect(
        service.createSubscriptionRequest('u-1', 'p-1'),
      ).rejects.toThrow('Subscription plan not found');
    });

    it('should create new pending request if none pending', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'p-1',
        durationDays: 30,
      });
      mockPrisma.subscriptionRequest.findFirst.mockResolvedValue(null);
      mockPrisma.subscriptionRequest.create.mockResolvedValue({
        id: 'sr-1',
        status: 'PENDING',
      });

      const result = await service.createSubscriptionRequest('u-1', 'p-1');
      expect(result.id).toBe('sr-1');
      expect(mockPrisma.subscriptionRequest.create).toHaveBeenCalled();
    });
  });

  describe('approveSubscriptionRequest', () => {
    it('should throw NotFoundException if request not found', async () => {
      mockPrisma.subscriptionRequest.findUnique.mockResolvedValue(null);
      await expect(
        service.approveSubscriptionRequest('sr-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should expire previous subs, create active sub and transaction, and approve request', async () => {
      mockPrisma.subscriptionRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        hostId: 'hp-1',
        planId: 'p-2',
        requestedDays: 30,
        plan: { durationDays: 30, price: '29.00' },
        host: { userId: 'u-1' },
      });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-new' });
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-1' });
      mockPrisma.subscriptionRequest.update.mockResolvedValue({
        id: 'sr-1',
        status: 'APPROVED',
      });

      const result = await service.approveSubscriptionRequest('sr-1', 30, 'Approved');
      expect(result.message).toContain('Subscription approved successfully');
      expect(mockPrisma.hostSubscription.updateMany).toHaveBeenCalledWith({
        where: { hostId: 'hp-1', status: 'ACTIVE' },
        data: { status: 'EXPIRED' },
      });
    });
  });

  describe('rejectSubscriptionRequest', () => {
    it('should throw NotFoundException if request not found', async () => {
      mockPrisma.subscriptionRequest.findUnique.mockResolvedValue(null);
      await expect(service.rejectSubscriptionRequest('sr-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update request to REJECTED', async () => {
      mockPrisma.subscriptionRequest.findUnique.mockResolvedValue({ id: 'sr-1' });
      mockPrisma.subscriptionRequest.update.mockResolvedValue({
        id: 'sr-1',
        status: 'REJECTED',
      });

      const result = await service.rejectSubscriptionRequest('sr-1', 'Reason');
      expect(result.status).toBe('REJECTED');
    });
  });

  describe('assignSubscriptionManually', () => {
    it('should throw BadRequestException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      await expect(
        service.assignSubscriptionManually('hp-1', 'p-1'),
      ).rejects.toThrow('Host profile not found');
    });

    it('should assign subscription directly and log transaction', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        userId: 'u-1',
      });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'p-1',
        price: '79.00',
      });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-1' });
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-1' });

      const result = await service.assignSubscriptionManually('hp-1', 'p-1', 60);
      expect(result.message).toContain('Direct subscription assigned successfully for 60 days');
    });
  });
});
