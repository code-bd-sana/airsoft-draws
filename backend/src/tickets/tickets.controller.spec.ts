import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('TicketsController', () => {
  let controller: TicketsController;
  let mockTicketsService: {
    purchaseTickets: jest.Mock;
    getUserTickets: jest.Mock;
    checkout: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockTicketsService = {
      purchaseTickets: jest.fn(),
      getUserTickets: jest.fn(),
      checkout: jest.fn(),
    };
    mockJwtService = { verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        { provide: TicketsService, useValue: mockTicketsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('purchaseTickets', () => {
    it('should throw BadRequestException if quantity < 1', async () => {
      const req = createMockRequest('token');
      await expect(
        controller.purchaseTickets(req, 'r-1', { quantity: 0 } as any),
      ).rejects.toThrow('Quantity is required and must be at least 1');
    });

    it('should throw UnauthorizedException if cookie missing', async () => {
      const req = createMockRequest();
      await expect(
        controller.purchaseTickets(req, 'r-1', { quantity: 2 } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should delegate purchase to ticketsService', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockTicketsService.purchaseTickets.mockResolvedValue({ success: true });

      const dto = { quantity: 3, acceptedTerms: true } as any;
      const result = await controller.purchaseTickets(req, 'r-1', dto);

      expect(mockTicketsService.purchaseTickets).toHaveBeenCalledWith(
        'u-1',
        'r-1',
        dto,
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('getMyTickets', () => {
    it('should return user tickets', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockTicketsService.getUserTickets.mockResolvedValue([{ id: 't-1' }]);

      const result = await controller.getMyTickets(req);
      expect(mockTicketsService.getUserTickets).toHaveBeenCalledWith('u-1');
      expect(result).toEqual([{ id: 't-1' }]);
    });
  });

  describe('checkout', () => {
    it('should throw UnauthorizedException if cookie missing', async () => {
      const req = createMockRequest();
      await expect(
        controller.checkout(req, { items: [] } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should delegate basket checkout to ticketsService', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockTicketsService.checkout.mockResolvedValue({
        message: 'Basket checkout completed successfully',
        totalAmount: 25,
      });

      const dto = {
        items: [{ raffleId: 'r-1', quantity: 2 }],
        firstName: 'Jade',
        lastName: 'Weeks',
        email: 'user@example.com',
        phone: '+44 7700 900077',
        dateOfBirth: '1995-05-15',
        shippingAddress: {
          addressLine1: '573 South Oak Lane',
          city: 'London',
          postalCode: 'SW1A 1AA',
          country: 'United Kingdom',
        },
        acceptedTerms: true,
      } as any;

      const result = await controller.checkout(req, dto);

      expect(mockTicketsService.checkout).toHaveBeenCalledWith('u-1', dto);
      expect(result).toEqual({
        message: 'Basket checkout completed successfully',
        totalAmount: 25,
      });
    });
  });
});
