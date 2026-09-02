import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  let mockService: {
    getOverviewStats: jest.Mock;
    getSystemLogs: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getOverviewStats: jest.fn(),
      getSystemLogs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [
        { provide: AdminDashboardService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminDashboardController>(AdminDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverviewStats', () => {
    it('should delegate to adminDashboardService.getOverviewStats', async () => {
      mockService.getOverviewStats.mockResolvedValue({ stats: {} });
      const result = await controller.getOverviewStats();
      expect(mockService.getOverviewStats).toHaveBeenCalled();
      expect(result).toEqual({ stats: {} });
    });
  });

  describe('getSystemLogs', () => {
    it('should delegate to adminDashboardService.getSystemLogs', async () => {
      mockService.getSystemLogs.mockResolvedValue({ logs: [] });
      const result = await controller.getSystemLogs(1, 10, 'search', 'All');
      expect(mockService.getSystemLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'search',
        filter: 'All',
      });
      expect(result).toEqual({ logs: [] });
    });
  });
});
