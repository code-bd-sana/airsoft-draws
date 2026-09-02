import { Test, TestingModule } from '@nestjs/testing';
import { AdminWithdrawalsController } from './admin-withdrawals.controller';
import { AdminWithdrawalsService } from './admin-withdrawals.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminWithdrawalsController', () => {
  let controller: AdminWithdrawalsController;
  let mockService: {
    findAll: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminWithdrawalsController],
      providers: [
        { provide: AdminWithdrawalsService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminWithdrawalsController>(AdminWithdrawalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service', async () => {
      mockService.findAll.mockResolvedValue([{ id: 'w-1' }]);
      const result = await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'w-1' }]);
    });
  });

  describe('updateStatus', () => {
    it('should delegate status update to service', async () => {
      mockService.updateStatus.mockResolvedValue({ id: 'w-1', status: 'COMPLETED' });
      const result = await controller.updateStatus('w-1', {
        status: 'COMPLETED',
        adminNotes: 'Paid',
      });
      expect(mockService.updateStatus).toHaveBeenCalledWith(
        'w-1',
        'COMPLETED',
        'Paid',
      );
      expect(result).toEqual({ id: 'w-1', status: 'COMPLETED' });
    });
  });
});
