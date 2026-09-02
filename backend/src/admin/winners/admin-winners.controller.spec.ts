import { Test, TestingModule } from '@nestjs/testing';
import { AdminWinnersController } from './admin-winners.controller';
import { AdminWinnersService } from './admin-winners.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('AdminWinnersController', () => {
  let controller: AdminWinnersController;
  let mockService: {
    getAllWinners: jest.Mock;
    verifyWinner: jest.Mock;
    saveIdDocument: jest.Mock;
    getIdDocumentPath: jest.Mock;
    updateVerification: jest.Mock;
    updateAlternative: jest.Mock;
    updateTransfer: jest.Mock;
    updateFulfillment: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getAllWinners: jest.fn(),
      verifyWinner: jest.fn(),
      saveIdDocument: jest.fn(),
      getIdDocumentPath: jest.fn(),
      updateVerification: jest.fn(),
      updateAlternative: jest.fn(),
      updateTransfer: jest.fn(),
      updateFulfillment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminWinnersController],
      providers: [
        { provide: AdminWinnersService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminWinnersController>(AdminWinnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllWinners', () => {
    it('should delegate to service', async () => {
      mockService.getAllWinners.mockResolvedValue({ data: [] });
      const result = await controller.getAllWinners({} as any);
      expect(mockService.getAllWinners).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('verifyWinner', () => {
    it('should verify winner with reviewerId', async () => {
      const req = { user: { id: 'admin-1' } };
      mockService.verifyWinner.mockResolvedValue({ id: 'w-1' });

      const result = await controller.verifyWinner(req, 'w-1');
      expect(mockService.verifyWinner).toHaveBeenCalledWith('w-1', 'admin-1');
      expect(result).toEqual({ id: 'w-1' });
    });
  });

  describe('uploadIdDocument', () => {
    it('should throw BadRequestException if file missing', async () => {
      const req = { user: { id: 'admin-1' } };
      expect(() => controller.uploadIdDocument(req, 'w-1', null as any)).toThrow(
        BadRequestException,
      );
    });

    it('should save id document when file provided', async () => {
      const req = { user: { id: 'admin-1' } };
      const file = { path: '/tmp/id.png', mimetype: 'image/png' } as Express.Multer.File;
      mockService.saveIdDocument.mockResolvedValue({ id: 'w-1' });

      const result = await controller.uploadIdDocument(req, 'w-1', file);
      expect(mockService.saveIdDocument).toHaveBeenCalledWith(
        'w-1',
        '/tmp/id.png',
        'IMAGE',
        'admin-1',
      );
      expect(result).toEqual({ id: 'w-1' });
    });
  });
});
