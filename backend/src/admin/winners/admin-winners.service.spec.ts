import { Test, TestingModule } from '@nestjs/testing';
import { AdminWinnersService } from './admin-winners.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

describe('AdminWinnersService', () => {
  let service: AdminWinnersService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminWinnersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminWinnersService>(AdminWinnersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWinners', () => {
    it('should return paginated list of winners', async () => {
      mockPrisma.winner.findMany.mockResolvedValue([
        { id: 'w-1', winType: 'MAIN_DRAW', deliveryStatus: 'PENDING' },
      ]);
      mockPrisma.winner.count.mockResolvedValue(1);

      const result = await service.getAllWinners(1, 10, 'PENDING', 'ALL', 'MAIN_DRAW');
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('verifyWinner', () => {
    it('should throw NotFoundException if winner not found', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue(null);
      await expect(service.verifyWinner('w-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should verify winner and log audit', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({
        id: 'w-1',
        raffle: { prizeClassification: 'RIF' },
      });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        verificationStatus: 'APPROVED_FOR_FULFILMENT',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.verifyWinner('w-1', 'admin-1');
      expect(result.verificationStatus).toBe('APPROVED_FOR_FULFILMENT');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('saveIdDocument', () => {
    it('should throw NotFoundException if winner not found', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue(null);
      await expect(
        service.saveIdDocument('w-unknown', '/path/id.png', 'IMAGE'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should save id document path and create audit log', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({ id: 'w-1' });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        verificationStatus: 'ID_SUBMITTED',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.saveIdDocument('w-1', '/path/id.png', 'IMAGE', 'admin-1');
      expect(result.verificationStatus).toBe('ID_SUBMITTED');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('updateVerification, updateAlternative, updateTransfer, updateFulfillment', () => {
    it('should update verification status', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({ id: 'w-1' });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        verificationStatus: 'VERIFIED',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.updateVerification('w-1', {
        verificationStatus: 'VERIFIED',
      });
      expect(result.verificationStatus).toBe('VERIFIED');
    });

    it('should update alternative prize', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({ id: 'w-1' });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        alternativeType: 'CASH_ALTERNATIVE',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.updateAlternative('w-1', {
        alternativeType: 'CASH_ALTERNATIVE',
        alternativeAmount: 400,
      });
      expect(result.alternativeType).toBe('CASH_ALTERNATIVE');
    });

    it('should update transfer recipient', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({ id: 'w-1' });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        transferStatus: 'APPROVED',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.updateTransfer('w-1', {
        transferRecipientName: 'Bob',
        transferStatus: 'APPROVED',
      });
      expect(result.transferStatus).toBe('APPROVED');
    });

    it('should update fulfillment details', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({
        id: 'w-1',
        verificationStatus: 'APPROVED_FOR_FULFILMENT',
        raffle: { prizeClassification: 'RIF' },
      });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        deliveryStatus: 'DISPATCHED',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.updateFulfillment('w-1', {
        deliveryStatus: 'DISPATCHED',
        trackingNumber: 'TRK1234',
      });
      expect(result.deliveryStatus).toBe('DISPATCHED');
    });
  });
});
