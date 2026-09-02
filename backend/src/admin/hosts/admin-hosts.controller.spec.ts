import { Test, TestingModule } from '@nestjs/testing';
import { AdminHostsController } from './admin-hosts.controller';
import { AdminHostsService } from './admin-hosts.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminHostsController', () => {
  let controller: AdminHostsController;
  let mockService: {
    getHosts: jest.Mock;
    getStats: jest.Mock;
    approveHost: jest.Mock;
    rejectHost: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getHosts: jest.fn(),
      getStats: jest.fn(),
      approveHost: jest.fn(),
      rejectHost: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminHostsController],
      providers: [
        { provide: AdminHostsService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminHostsController>(AdminHostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHosts', () => {
    it('should delegate to adminHostsService.getHosts', async () => {
      mockService.getHosts.mockResolvedValue({ hosts: [] });
      const result = await controller.getHosts({
        page: '1',
        limit: '10',
        search: 'Apex',
        status: 'Active',
      } as any);
      expect(mockService.getHosts).toHaveBeenCalledWith(1, 10, 'Apex', 'Active');
      expect(result).toEqual({ hosts: [] });
    });
  });

  describe('getStats', () => {
    it('should delegate to adminHostsService.getStats', async () => {
      mockService.getStats.mockResolvedValue({ totalHosts: 10 });
      const result = await controller.getStats();
      expect(result).toEqual({ totalHosts: 10 });
    });
  });

  describe('approveHost and rejectHost', () => {
    it('should approve host', async () => {
      mockService.approveHost.mockResolvedValue({ id: 'hp-1' });
      const result = await controller.approveHost('hp-1');
      expect(result).toEqual({ id: 'hp-1' });
    });

    it('should reject host', async () => {
      mockService.rejectHost.mockResolvedValue({ id: 'hp-1' });
      const result = await controller.rejectHost('hp-1');
      expect(result).toEqual({ id: 'hp-1' });
    });
  });
});
