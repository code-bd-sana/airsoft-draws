import { Test, TestingModule } from '@nestjs/testing';
import { AdminWithdrawalsService } from './admin-withdrawals.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

import { NotificationsService } from '../../notifications/notifications.service';

describe('AdminWithdrawalsService', () => {
  let service: AdminWithdrawalsService;
  let mockPrisma: MockPrismaService;
  let mockNotificationsService: { createNotification: jest.Mock; notifyAdmins: jest.Mock };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue({ id: 'notif-1' }),
      notifyAdmins: jest.fn().mockResolvedValue({ count: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminWithdrawalsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<AdminWithdrawalsService>(AdminWithdrawalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return mapped withdrawals with parsed details', async () => {
      mockPrisma.withdrawal.findMany.mockResolvedValue([
        {
          id: 'w-1',
          hostId: 'hp-1',
          amount: '100.00',
          feeAmount: '10.00',
          netAmount: '90.00',
          status: 'PENDING',
          payoutMethod: 'BANK_TRANSFER',
          payoutDetails: '{"accountNumber":"12345"}',
          createdAt: new Date(),
          updatedAt: new Date(),
          host: {
            businessName: 'Host Club',
            user: { firstName: 'Bob', lastName: 'Host', email: 'bob@host.com' },
          },
        },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].hostBusinessName).toBe('Host Club');
      expect(result[0].payoutDetails).toEqual({ accountNumber: '12345' });
      expect(result[0].feeAmount).toBe(10);
      expect(result[0].netAmount).toBe(90);
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException if withdrawal not found', async () => {
      mockPrisma.withdrawal.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('w-unknown', 'APPROVED')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return withdrawal if status is unchanged', async () => {
      mockPrisma.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        status: 'APPROVED',
      });

      const result = await service.updateStatus('w-1', 'APPROVED');
      expect(result.status).toBe('APPROVED');
    });

    it('should refund host wallet balance when rejecting a PENDING withdrawal', async () => {
      mockPrisma.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        hostId: 'hp-1',
        amount: '100.00',
        status: 'PENDING',
        host: { userId: 'host-user-1' },
      });
      mockPrisma.hostProfile.update.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.withdrawal.update.mockResolvedValue({
        id: 'w-1',
        status: 'REJECTED',
        adminNotes: 'Invalid details',
      });

      const result = await service.updateStatus('w-1', 'REJECTED', 'Invalid details');
      expect(result.status).toBe('REJECTED');
      expect(mockPrisma.hostProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'hp-1' },
          data: { walletBalance: { increment: '100.00' } },
        }),
      );
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'host-user-1',
          type: 'WITHDRAWAL',
          title: 'Withdrawal Request Rejected',
        }),
      );
    });

    it('should update status to COMPLETED without refunding wallet and notify host', async () => {
      mockPrisma.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        hostId: 'hp-1',
        amount: '100.00',
        status: 'PENDING',
        host: { userId: 'host-user-1' },
      });
      mockPrisma.withdrawal.update.mockResolvedValue({
        id: 'w-1',
        status: 'COMPLETED',
      });

      const result = await service.updateStatus('w-1', 'COMPLETED');
      expect(result.status).toBe('COMPLETED');
      expect(mockPrisma.hostProfile.update).not.toHaveBeenCalled();
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'host-user-1',
          type: 'WITHDRAWAL',
          title: 'Withdrawal Approved',
        }),
      );
    });
  });
});
