import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('PaymentController', () => {
  let controller: PaymentController;
  let mockPaymentService: {
    createSubscriptionCheckout: jest.Mock;
    handleWebhook: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockPaymentService = {
      createSubscriptionCheckout: jest.fn(),
      handleWebhook: jest.fn(),
    };
    mockJwtService = { verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubscriptionCheckout', () => {
    it('should throw BadRequestException if planId missing', async () => {
      const req = createMockRequest('token');
      await expect(
        controller.createSubscriptionCheckout(req, { planId: '' } as any),
      ).rejects.toThrow('planId is required');
    });

    it('should throw UnauthorizedException if cookie missing', async () => {
      const req = createMockRequest();
      await expect(
        controller.createSubscriptionCheckout(req, { planId: 'p-1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should delegate to paymentService', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockPaymentService.createSubscriptionCheckout.mockResolvedValue({
        url: 'https://checkout.cashflows.com',
      });

      const result = await controller.createSubscriptionCheckout(req, {
        planId: 'p-1',
      });
      expect(mockPaymentService.createSubscriptionCheckout).toHaveBeenCalledWith(
        'u-1',
        'p-1',
      );
      expect(result).toEqual({ url: 'https://checkout.cashflows.com' });
    });
  });

  describe('handleWebhook', () => {
    it('should delegate webhook payload and signature to paymentService', async () => {
      const req = { body: { event: 'PAYMENT_SUCCESS' } };
      const headers = { hash: 'HASH123' };
      mockPaymentService.handleWebhook.mockResolvedValue({ success: true });

      const result = await controller.handleWebhook(req, headers);
      expect(mockPaymentService.handleWebhook).toHaveBeenCalledWith(
        'HASH123',
        req.body,
      );
      expect(result).toEqual({ success: true });
    });
  });
});
