import { Test, TestingModule } from '@nestjs/testing';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('HostsController', () => {
  let controller: HostsController;
  let mockHostsService: {
    findAllVerifiedPublic: jest.Mock;
    findOnePublic: jest.Mock;
    getHostDashboardOverview: jest.Mock;
    getWalletStats: jest.Mock;
    requestWithdrawal: jest.Mock;
    getWithdrawalsHistory: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockHostsService = {
      findAllVerifiedPublic: jest.fn(),
      findOnePublic: jest.fn(),
      getHostDashboardOverview: jest.fn(),
      getWalletStats: jest.fn(),
      requestWithdrawal: jest.fn(),
      getWithdrawalsHistory: jest.fn(),
    };
    mockJwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostsController],
      providers: [
        { provide: HostsService, useValue: mockHostsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<HostsController>(HostsController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllVerifiedPublic', () => {
    it('should return verified hosts', async () => {
      mockHostsService.findAllVerifiedPublic.mockResolvedValue([{ id: 'hp-1' }]);
      const result = await controller.findAllVerifiedPublic();
      expect(result).toEqual([{ id: 'hp-1' }]);
    });
  });

  describe('findOnePublic', () => {
    it('should return host profile by slug', async () => {
      mockHostsService.findOnePublic.mockResolvedValue({ id: 'hp-1' });
      const result = await controller.findOnePublic('slug-1');
      expect(mockHostsService.findOnePublic).toHaveBeenCalledWith('slug-1');
      expect(result).toEqual({ id: 'hp-1' });
    });
  });

  describe('getDashboardOverview', () => {
    it('should throw UnauthorizedException if cookie missing', async () => {
      const req = createMockRequest();
      expect(() => controller.getDashboardOverview(req)).toThrow(
        UnauthorizedException,
      );
    });

    it('should return dashboard overview for host', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockHostsService.getHostDashboardOverview.mockResolvedValue({ kpiStats: {} });

      const result = await controller.getDashboardOverview(req);
      expect(mockHostsService.getHostDashboardOverview).toHaveBeenCalledWith('u-1');
      expect(result).toEqual({ kpiStats: {} });
    });
  });

  describe('getWalletStats', () => {
    it('should return wallet stats for host', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockHostsService.getWalletStats.mockResolvedValue({ availableBalance: 100 });

      const result = await controller.getWalletStats(req);
      expect(mockHostsService.getWalletStats).toHaveBeenCalledWith('u-1');
      expect(result).toEqual({ availableBalance: 100 });
    });
  });

  describe('requestWithdrawal', () => {
    it('should delegate withdrawal request to hostsService', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockHostsService.requestWithdrawal.mockResolvedValue({ message: 'ok' });

      const dto = { amount: 50, payoutMethod: 'Bank', payoutDetails: {} };
      const result = await controller.requestWithdrawal(req, dto);

      expect(mockHostsService.requestWithdrawal).toHaveBeenCalledWith('u-1', dto);
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('getWithdrawalsHistory', () => {
    it('should return withdrawal history', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockHostsService.getWithdrawalsHistory.mockResolvedValue([{ id: 'w-1' }]);

      const result = await controller.getWithdrawalsHistory(req);
      expect(mockHostsService.getWithdrawalsHistory).toHaveBeenCalledWith('u-1');
      expect(result).toEqual([{ id: 'w-1' }]);
    });
  });
});
