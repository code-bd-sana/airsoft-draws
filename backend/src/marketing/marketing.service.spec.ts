import { Test, TestingModule } from '@nestjs/testing';
import { MarketingService } from './marketing.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('MarketingService', () => {
  let service: MarketingService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MarketingService>(MarketingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create marketing report and audit log', async () => {
      mockPrisma.marketingReport.create.mockResolvedValue({
        id: 'mr-1',
        reason: 'Misleading description',
        status: 'SUBMITTED',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-1' });

      const result = await service.createReport({
        reason: 'Misleading description',
        description: 'Prize does not match image',
        reporterEmail: 'reporter@test.com',
      });

      expect(result.id).toBe('mr-1');
      expect(mockPrisma.marketingReport.create).toHaveBeenCalled();
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'MARKETING_REPORT_SUBMITTED',
            entityId: 'mr-1',
          }),
        }),
      );
    });
  });

  describe('getAllReports', () => {
    it('should return all reports ordered by createdAt desc', async () => {
      mockPrisma.marketingReport.findMany.mockResolvedValue([{ id: 'mr-1' }]);
      const reports = await service.getAllReports();
      expect(reports).toHaveLength(1);
    });
  });

  describe('updateReportStatus', () => {
    it('should throw NotFoundException if report not found', async () => {
      mockPrisma.marketingReport.findUnique.mockResolvedValue(null);
      await expect(
        service.updateReportStatus('mr-unknown', 'RESOLVED'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update status and create audit log', async () => {
      mockPrisma.marketingReport.findUnique.mockResolvedValue({
        id: 'mr-1',
        assignedReviewerId: null,
        resolutionNotes: null,
      });
      mockPrisma.marketingReport.update.mockResolvedValue({
        id: 'mr-1',
        status: 'RESOLVED',
        resolutionNotes: 'Reviewed and approved',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'al-2' });

      const result = await service.updateReportStatus(
        'mr-1',
        'RESOLVED',
        'admin-1',
        'Reviewed and approved',
      );

      expect(result.status).toBe('RESOLVED');
      expect(mockPrisma.marketingReport.update).toHaveBeenCalled();
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });
  });
});
