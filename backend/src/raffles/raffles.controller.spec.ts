import { Test, TestingModule } from '@nestjs/testing';
import { RafflesController } from './raffles.controller';
import { RafflesService } from './raffles.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('RafflesController', () => {
  let controller: RafflesController;
  let mockRafflesService: {
    getLiveHeroStats: jest.Mock;
    getPublicStats: jest.Mock;
    getPublicWinnerStats: jest.Mock;
    getRecentWinners: jest.Mock;
    getPublicWinnersList: jest.Mock;
    findAllPublic: jest.Mock;
    findOnePublic: jest.Mock;
    create: jest.Mock;
    findHostRaffles: jest.Mock;
    findOneHost: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    drawWinner: jest.Mock;
    updateWinnerDeliveryStatus: jest.Mock;
    getRaffleSoldTickets: jest.Mock;
    getWinners: jest.Mock;
    updateMainImage: jest.Mock;
    getPendingApprovals: jest.Mock;
    findAllAdmin: jest.Mock;
    adminDelete: jest.Mock;
    approve: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockRafflesService = {
      getLiveHeroStats: jest.fn(),
      getPublicStats: jest.fn(),
      getPublicWinnerStats: jest.fn(),
      getRecentWinners: jest.fn(),
      getPublicWinnersList: jest.fn(),
      findAllPublic: jest.fn(),
      findOnePublic: jest.fn(),
      create: jest.fn(),
      findHostRaffles: jest.fn(),
      findOneHost: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      drawWinner: jest.fn(),
      updateWinnerDeliveryStatus: jest.fn(),
      getRaffleSoldTickets: jest.fn(),
      getWinners: jest.fn(),
      updateMainImage: jest.fn(),
      getPendingApprovals: jest.fn(),
      findAllAdmin: jest.fn(),
      adminDelete: jest.fn(),
      approve: jest.fn(),
    };
    mockJwtService = { verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RafflesController],
      providers: [
        { provide: RafflesService, useValue: mockRafflesService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<RafflesController>(RafflesController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
      headers: { host: 'localhost:5000' },
      protocol: 'http',
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('public endpoints', () => {
    it('should return live hero stats', async () => {
      mockRafflesService.getLiveHeroStats.mockResolvedValue({ totalLive: 5 });
      const result = await controller.getLiveHeroStats();
      expect(result).toEqual({ totalLive: 5 });
    });

    it('should return public stats', async () => {
      mockRafflesService.getPublicStats.mockResolvedValue({ totalPrizes: 10 });
      const result = await controller.getPublicStats();
      expect(result).toEqual({ totalPrizes: 10 });
    });

    it('should return public raffles list', async () => {
      mockRafflesService.findAllPublic.mockResolvedValue({ raffles: [] });
      const result = await controller.findAllPublic({ page: 1 } as any);
      expect(result).toEqual({ raffles: [] });
    });

    it('should return single public raffle', async () => {
      mockRafflesService.findOnePublic.mockResolvedValue({ id: 'r-1' });
      const result = await controller.findOnePublic('slug-1');
      expect(result).toEqual({ id: 'r-1' });
    });
  });

  describe('host endpoints', () => {
    it('should throw UnauthorizedException if cookie missing in create', async () => {
      const req = createMockRequest();
      expect(() => controller.create(req, { title: 'New' } as any)).toThrow(
        UnauthorizedException,
      );
    });

    it('should delegate create to service with extracted userId', async () => {
      const req = createMockRequest('token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockRafflesService.create.mockResolvedValue({ id: 'r-1' });

      const dto = { title: 'New Raffle' } as any;
      const result = await controller.create(req, dto);
      expect(mockRafflesService.create).toHaveBeenCalledWith('u-1', dto);
      expect(result).toEqual({ id: 'r-1' });
    });

    it('should delegate findHostRaffles', async () => {
      const req = createMockRequest('token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockRafflesService.findHostRaffles.mockResolvedValue([]);

      const result = await controller.findHostRaffles(req, {} as any);
      expect(mockRafflesService.findHostRaffles).toHaveBeenCalledWith('u-1', {});
      expect(result).toEqual([]);
    });

    it('should delegate update and delete', async () => {
      const req = createMockRequest('token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockRafflesService.update.mockResolvedValue({ id: 'r-1' });
      mockRafflesService.remove.mockResolvedValue({ message: 'deleted' });

      await controller.update(req, 'r-1', { title: 'Updated' } as any);
      expect(mockRafflesService.update).toHaveBeenCalledWith('r-1', 'u-1', {
        title: 'Updated',
      });

      const delResult = await controller.remove(req, 'r-1');
      expect(delResult).toEqual({ message: 'deleted' });
    });
  });

  describe('admin & draw endpoints', () => {
    it('should delegate drawWinner to service', async () => {
      const req = createMockRequest('token');
      mockRafflesService.drawWinner.mockResolvedValue({ winner: 'w-1' });

      const result = await controller.adminDrawWinner(req, 'r-1', {
        winningTicketNumber: '001',
      });
      expect(mockRafflesService.drawWinner).toHaveBeenCalledWith('r-1', '001');
      expect(result).toEqual({ winner: 'w-1' });
    });

    it('should delegate approve and adminDelete', async () => {
      mockRafflesService.approve.mockResolvedValue({ id: 'r-1', status: 'ACTIVE' });
      mockRafflesService.adminDelete.mockResolvedValue({ message: 'deleted' });

      const appResult = await controller.approve('r-1');
      expect(appResult.status).toBe('ACTIVE');

      const delResult = await controller.adminDelete('r-1');
      expect(delResult).toEqual({ message: 'deleted' });
    });
  });
});
