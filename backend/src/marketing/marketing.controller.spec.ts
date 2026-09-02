import { Test, TestingModule } from '@nestjs/testing';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';
import { JwtService } from '@nestjs/jwt';

describe('MarketingController', () => {
  let controller: MarketingController;
  let mockMarketingService: {
    createReport: jest.Mock;
    getAllReports: jest.Mock;
    updateReportStatus: jest.Mock;
  };

  beforeEach(async () => {
    mockMarketingService = {
      createReport: jest.fn(),
      getAllReports: jest.fn(),
      updateReportStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketingController],
      providers: [
        { provide: MarketingService, useValue: mockMarketingService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<MarketingController>(MarketingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReport', () => {
    it('should delegate report creation to service', async () => {
      const dto = {
        reason: 'Misleading Ads',
        description: 'False claims',
      };
      mockMarketingService.createReport.mockResolvedValue({ id: 'mr-1' });

      const result = await controller.createReport(dto);
      expect(mockMarketingService.createReport).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 'mr-1' });
    });
  });

  describe('getAllReports', () => {
    it('should return all reports', async () => {
      mockMarketingService.getAllReports.mockResolvedValue([{ id: 'mr-1' }]);
      const result = await controller.getAllReports();
      expect(result).toEqual([{ id: 'mr-1' }]);
    });
  });

  describe('updateReport', () => {
    it('should update report status with reviewerId from req.user', async () => {
      const req = { user: { id: 'admin-1' } };
      mockMarketingService.updateReportStatus.mockResolvedValue({ id: 'mr-1', status: 'RESOLVED' });

      const result = await controller.updateReport(req, 'mr-1', {
        status: 'RESOLVED',
        notes: 'Resolved',
      });

      expect(mockMarketingService.updateReportStatus).toHaveBeenCalledWith(
        'mr-1',
        'RESOLVED',
        'admin-1',
        'Resolved',
      );
      expect(result).toEqual({ id: 'mr-1', status: 'RESOLVED' });
    });
  });
});
