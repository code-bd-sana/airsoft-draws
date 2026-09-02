import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminOrdersService } from './admin-orders.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;
  let mockService: {
    getAllOrders: jest.Mock;
    getOrdersStats: jest.Mock;
    processRefund: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getAllOrders: jest.fn(),
      getOrdersStats: jest.fn(),
      processRefund: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrdersController],
      providers: [
        { provide: AdminOrdersService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminOrdersController>(AdminOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should delegate to adminOrdersService.getAllOrders', async () => {
      mockService.getAllOrders.mockResolvedValue({ orders: [] });
      const result = await controller.getAllOrders({
        page: '1',
        limit: '10',
        search: 'Alice',
      } as any);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(1, 10, 'Alice');
      expect(result).toEqual({ orders: [] });
    });
  });

  describe('getOrdersStats', () => {
    it('should delegate to adminOrdersService.getOrdersStats', async () => {
      mockService.getOrdersStats.mockResolvedValue({ totalOrders: 5 });
      const result = await controller.getOrdersStats();
      expect(mockService.getOrdersStats).toHaveBeenCalled();
      expect(result).toEqual({ totalOrders: 5 });
    });
  });

  describe('processRefund', () => {
    it('should delegate refund to adminOrdersService.processRefund', async () => {
      mockService.processRefund.mockResolvedValue({ message: 'Refunded' });
      const result = await controller.processRefund('tx-1', {
        reason: 'Customer cancelled',
      });
      expect(mockService.processRefund).toHaveBeenCalledWith(
        'tx-1',
        'Customer cancelled',
      );
      expect(result).toEqual({ message: 'Refunded' });
    });
  });
});
