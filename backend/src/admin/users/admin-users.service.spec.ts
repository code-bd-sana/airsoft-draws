import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from './admin-users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated formatted users with tickets and totalSpent', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: 'u-1',
          email: 'user@test.com',
          firstName: 'User',
          lastName: 'One',
          role: 'CLIENT',
          isBlocked: false,
          isEmailVerified: true,
          createdAt: new Date(),
          _count: { tickets: 5 },
          transactions: [{ amount: '25.00' }, { amount: '15.00' }],
        },
      ]);
      mockPrisma.user.count.mockResolvedValue(1);

      const result = await service.getUsers(1, 10, 'user@test.com', 'CLIENT');
      expect(result.users).toHaveLength(1);
      expect(result.users[0].totalSpent).toBe(40);
      expect(result.users[0].ticketsCount).toBe(5);
      expect(result.total).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should calculate active and blocked counts and percentages', async () => {
      mockPrisma.user.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(20) // new this month
        .mockResolvedValueOnce(90) // active
        .mockResolvedValueOnce(10); // blocked

      const stats = await service.getStats();
      expect(stats.totalUsers).toBe(100);
      expect(stats.activeUsers).toBe(90);
      expect(stats.blockedUsers).toBe(10);
      expect(stats.activePercentage).toBe('90.0');
      expect(stats.blockedPercentage).toBe('10.0');
    });
  });

  describe('toggleBlockStatus', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.toggleBlockStatus('u-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should toggle isBlocked from false to true', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1', isBlocked: false });
      mockPrisma.user.update.mockResolvedValue({
        id: 'u-1',
        email: 'u1@test.com',
        isBlocked: true,
      });

      const result = await service.toggleBlockStatus('u-1');
      expect(result.isBlocked).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { isBlocked: true },
        select: { id: true, email: true, isBlocked: true },
      });
    });
  });
});
