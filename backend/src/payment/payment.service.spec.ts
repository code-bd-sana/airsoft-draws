import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';
import { BadRequestException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockPrisma: MockPrismaService;
  let mockTicketsService: { allocateTicketsInDatabase: jest.Mock };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockTicketsService = {
      allocateTicketsInDatabase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TicketsService, useValue: mockTicketsService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    process.env.ENABLE_AUTOMATIC_PAYMENT = 'true';
    process.env.USE_TEST_PAYMENT = 'false';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubscriptionCheckout', () => {
    it('should throw BadRequestException if plan not found', async () => {
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(null);

      await expect(
        service.createSubscriptionCheckout('u-1', 'p-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if host not found', async () => {
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({ id: 'p-1', price: '29.00' });
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.createSubscriptionCheckout('u-1', 'p-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should activate immediately for Free plan (price 0)', async () => {
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'p-free',
        name: 'Free',
        price: '0.00',
        durationDays: 30,
      });
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        user: { id: 'u-1', email: 'host@test.com' },
      });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-free' });
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-free' });

      const result = await service.createSubscriptionCheckout('u-1', 'p-free');
      expect(result.isFree).toBe(true);
      expect(result.isTest).toBe(true);
      expect(mockPrisma.hostSubscription.create).toHaveBeenCalled();
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ paymentGateway: 'FREE', amount: 0 }),
        }),
      );
    });

    it('should return manual mode response when ENABLE_AUTOMATIC_PAYMENT is false', async () => {
      process.env.ENABLE_AUTOMATIC_PAYMENT = 'false';
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'p-premium',
        name: 'Premium',
        price: '29.00',
        durationDays: 30,
      });
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        user: { id: 'u-1' },
      });

      const result = await service.createSubscriptionCheckout('u-1', 'p-premium');
      expect(result.isManualMode).toBe(true);
    });

    it('should activate test subscription when USE_TEST_PAYMENT is true', async () => {
      process.env.USE_TEST_PAYMENT = 'true';
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'p-premium',
        name: 'Premium',
        price: '29.00',
        durationDays: 30,
      });
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        user: { id: 'u-1' },
      });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-test' });
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-test' });

      const result = await service.createSubscriptionCheckout('u-1', 'p-premium');
      expect(result.isTest).toBe(true);
      expect(result.message).toBe('Test payment successful');
    });
  });

  describe('handleWebhook', () => {
    it('should process ticket purchase webhook and call ticketsService', async () => {
      const orderNumber = 'TCK_raff_user_5_123456';
      mockPrisma.raffle.findFirst.mockResolvedValue({ id: 'raff-1' });
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
      mockTicketsService.allocateTicketsInDatabase.mockResolvedValue({
        tickets: [{ ticketNumber: '001' }],
      });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'SETTLED',
      });

      expect(result.success).toBe(true);
      expect(mockTicketsService.allocateTicketsInDatabase).toHaveBeenCalledWith(
        'user-1',
        'raff-1',
        5,
      );
    });

    it('should process host subscription webhook and update subscription', async () => {
      const orderNumber = 'SUB_host1_plan1_123456';
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue({
        id: 'plan-1',
        name: 'Premium',
        durationDays: 30,
      });
      mockPrisma.hostProfile.findFirst.mockResolvedValue({ id: 'host-1' });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-1' });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'SETTLED',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.hostSubscription.create).toHaveBeenCalled();
    });

    it('should NOT allocate tickets if webhook payment status is CANCELLED or FAILED', async () => {
      const orderNumber = 'TCK_raff_user_5_123456';
      mockPrisma.raffle.findFirst.mockResolvedValue({ id: 'raff-1' });
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'user-1' });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'CANCELLED',
      });

      expect(result.success).toBe(true);
      expect(mockTicketsService.allocateTicketsInDatabase).not.toHaveBeenCalled();
    });

    it('should mark transaction CANCELLED and NOT allocate tickets when BSK order receives CANCELLED', async () => {
      const orderNumber = 'BSK_tx-1_123456';
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        status: 'PENDING',
        userId: 'user-1',
        relatedEntityId: 'BSK_ITEMS:raff-1:2',
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'tx-1',
        status: 'CANCELLED',
      });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'CANCELLED',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: expect.objectContaining({ status: 'CANCELLED' }),
      });
      expect(mockTicketsService.allocateTicketsInDatabase).not.toHaveBeenCalled();
    });

    it('should process paid BSK basket order and allocate tickets when PAID', async () => {
      const orderNumber = 'BSK_tx-1_123456';
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        status: 'PENDING',
        userId: 'user-1',
        relatedEntityId: 'BSK_ITEMS:raff-1:2',
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'tx-1',
        status: 'COMPLETED',
      });
      mockTicketsService.allocateTicketsInDatabase.mockResolvedValue({
        tickets: [{ ticketNumber: '101' }, { ticketNumber: '102' }],
      });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'PAID',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: expect.objectContaining({ status: 'COMPLETED' }),
      });
      expect(mockTicketsService.allocateTicketsInDatabase).toHaveBeenCalledWith(
        'user-1',
        'raff-1',
        2,
        'tx-1',
      );
    });

    it('should NOT allocate tickets if webhook status is CANCELLED or DECLINED', async () => {
      const orderNumber = 'BSK_tx-fail_123456';
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-fail',
        userId: 'user-fail',
        status: 'PENDING',
        relatedEntityId: 'BSK_ITEMS:raff-fail:2',
      });

      const result = await service.handleWebhook('sig', {
        order: { orderNumber },
        paymentStatus: 'CANCELLED',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-fail' },
        data: expect.objectContaining({ status: 'CANCELLED' }),
      });
      expect(mockTicketsService.allocateTicketsInDatabase).not.toHaveBeenCalled();
    });
  });

  describe('confirmPaymentReturn', () => {
    it('should throw BadRequestException if neither orderNumber nor paymentJobRef provided', async () => {
      await expect(service.confirmPaymentReturn({})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should confirm ticket purchase return', async () => {
      const orderNumber = 'TCK_raff_user_2_123456';
      mockPrisma.raffle.findFirst.mockResolvedValue({ id: 'raff-1' });
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
      mockTicketsService.allocateTicketsInDatabase.mockResolvedValue({
        tickets: [{ ticketNumber: '001' }, { ticketNumber: '002' }],
      });

      const result = await service.confirmPaymentReturn({ orderNumber });
      expect(result.success).toBe(true);
      expect(result.type).toBe('TICKET_PURCHASE');
    });

    it('should confirm subscription return', async () => {
      const orderNumber = 'SUB_host1_plan1_123456';
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue({
        id: 'plan-1',
        name: 'Pro',
        durationDays: 30,
      });
      mockPrisma.hostProfile.findFirst.mockResolvedValue({ id: 'host-1' });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-1' });

      const result = await service.confirmPaymentReturn({ orderNumber });
      expect(result.success).toBe(true);
      expect(result.type).toBe('SUBSCRIPTION');
    });
  });
});

