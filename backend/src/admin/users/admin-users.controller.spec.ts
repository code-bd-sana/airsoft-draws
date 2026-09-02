import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminUsersController', () => {
  let controller: AdminUsersController;
  let mockService: {
    getUsers: jest.Mock;
    getStats: jest.Mock;
    toggleBlockStatus: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getUsers: jest.fn(),
      getStats: jest.fn(),
      toggleBlockStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUsersController],
      providers: [
        { provide: AdminUsersService, useValue: mockService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminUsersController>(AdminUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should delegate to adminUsersService.getUsers', async () => {
      mockService.getUsers.mockResolvedValue({ users: [] });
      const result = await controller.getUsers({
        page: '1',
        limit: '10',
        search: 'Alice',
        role: 'CLIENT',
      } as any);
      expect(mockService.getUsers).toHaveBeenCalledWith(1, 10, 'Alice', 'CLIENT');
      expect(result).toEqual({ users: [] });
    });
  });

  describe('getStats', () => {
    it('should delegate to adminUsersService.getStats', async () => {
      mockService.getStats.mockResolvedValue({ totalUsers: 50 });
      const result = await controller.getStats();
      expect(result).toEqual({ totalUsers: 50 });
    });
  });

  describe('toggleBlockStatus', () => {
    it('should delegate toggle to adminUsersService', async () => {
      mockService.toggleBlockStatus.mockResolvedValue({ id: 'u-1', isBlocked: true });
      const result = await controller.toggleBlockStatus('u-1');
      expect(mockService.toggleBlockStatus).toHaveBeenCalledWith('u-1');
      expect(result).toEqual({ id: 'u-1', isBlocked: true });
    });
  });
});
