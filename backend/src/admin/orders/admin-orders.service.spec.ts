import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersService } from './admin-orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

describe('AdminOrdersService', () => {
  let service: AdminOrdersService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminOrdersService>(AdminOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return paginated and mapped orders', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([
        {
          id: 'tx-1',
          gatewayTransactionId: 'GTX12345678',
          amount: '50.00',
          status: 'COMPLETED',
          paymentGateway: 'Cashflows',
          createdAt: new Date(),
          user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com' },
          tickets: [{ id: 't-1', raffle: { title: 'M4 Raffle' } }],
        },
      ]);
      mockPrisma.transaction.count.mockResolvedValue(1);

      const result = await service.getAllOrders(1, 10, 'alice');
      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].buyerName).toBe('Alice Smith');
      expect(result.orders[0].competition).toBe('M4 Raffle');
      expect(result.orders[0].status).toBe('Paid');
      expect(result.total).toBe(1);
    });
  });

  describe('getOrdersStats', () => {
    it('should aggregate order metrics', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([
        {
          id: 't-1',
          amount: '100.00',
          status: 'COMPLETED',
          _count: { tickets: 10 },
        },
        {
          id: 't-2',
          amount: '50.00',
          status: 'REFUNDED',
          _count: { tickets: 5 },
        },
      ]);

      const stats = await service.getOrdersStats();
      expect(stats.totalOrders).toBe(2);
      expect(stats.totalTicketsSold).toBe(15);
      expect(stats.totalOrderValue).toBe(100);
      expect(stats.refundedOrders).toBe(1);
    });
  });

  describe('processRefund', () => {
    it('should throw NotFoundException if transaction not found', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null);
      await expect(service.processRefund('tx-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if not a ticket purchase', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        type: 'SUBSCRIPTION_FEE',
      });
      await expect(service.processRefund('tx-1')).rejects.toThrow(
        'Can only refund ticket purchases',
      );
    });

    it('should throw BadRequestException if already refunded', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        type: 'TICKET_PURCHASE',
        status: 'REFUNDED',
      });
      await expect(service.processRefund('tx-1')).rejects.toThrow(
        'Transaction is already refunded',
      );
    });

    it('should throw BadRequestException if not COMPLETED', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        type: 'TICKET_PURCHASE',
        status: 'PENDING',
      });
      await expect(service.processRefund('tx-1')).rejects.toThrow(
        'Cannot refund a transaction with status PENDING',
      );
    });

    it('should successfully update status to REFUNDED', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        type: 'TICKET_PURCHASE',
        status: 'COMPLETED',
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'tx-1',
        status: 'REFUNDED',
      });

      const result = await service.processRefund('tx-1', 'Customer request');
      expect(result.message).toBe('Refund processed successfully');
      expect(result.transaction.status).toBe('REFUNDED');
    });
  });
});
