import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminDashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminDashboardService>(AdminDashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverviewStats', () => {
    it('should aggregate counts, revenue, awaiting reviews, and recent activity', async () => {
      mockPrisma.user.count.mockResolvedValue(100);
      mockPrisma.hostProfile.count.mockResolvedValue(10);
      mockPrisma.raffle.count
        .mockResolvedValueOnce(5) // live raffles
        .mockResolvedValueOnce(2); // awaiting review
      mockPrisma.transaction.aggregate.mockResolvedValue({
        _sum: { amount: '5000.00' },
      });
      mockPrisma.raffle.findMany
        .mockResolvedValueOnce([
          {
            id: 'r-pending-1',
            title: 'Pending Raffle',
            createdAt: new Date(),
            host: { businessName: 'Club A' },
          },
        ])
        .mockResolvedValueOnce([]); // recent raffles
      mockPrisma.hostProfile.findMany.mockResolvedValue([
        { businessName: 'Host B', createdAt: new Date() },
      ]);
      mockPrisma.user.findMany.mockResolvedValue([
        { email: 'user@test.com', createdAt: new Date() },
      ]);
      mockPrisma.withdrawal.findMany.mockResolvedValue([
        { amount: '100.00', status: 'PENDING', createdAt: new Date() },
      ]);
      mockPrisma.transaction.findMany.mockResolvedValue([
        { amount: '25.00', createdAt: new Date() },
      ]);

      const result = await service.getOverviewStats();
      expect(result.stats.totalUsers).toBe(100);
      expect(result.stats.activeHosts).toBe(10);
      expect(result.stats.liveRaffles).toBe(5);
      expect(result.stats.totalRevenue).toBe(5000);
      expect(result.awaitingReview.count).toBe(2);
      expect(result.recentActivity.length).toBeGreaterThan(0);
    });
  });

  describe('getSystemLogs', () => {
    it('should compile and paginate system logs with filters', async () => {
      const now = new Date();
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'u1', email: 'alice@test.com', role: 'CLIENT', isBlocked: true, createdAt: now },
      ]);
      mockPrisma.hostProfile.findMany.mockResolvedValue([
        { id: 'h1', businessName: 'Host One', createdAt: now, user: { email: 'host@test.com' } },
      ]);
      mockPrisma.raffle.findMany.mockResolvedValue([
        { id: 'r1', title: 'M4', status: 'ACTIVE', createdAt: now, host: { businessName: 'Host One' } },
      ]);
      mockPrisma.transaction.findMany.mockResolvedValue([
        { id: 't1', amount: '10.00', type: 'TICKET_PURCHASE', status: 'COMPLETED', createdAt: now, user: { email: 'alice@test.com' } },
      ]);
      mockPrisma.withdrawal.findMany.mockResolvedValue([
        { id: 'w1', amount: '50.00', status: 'COMPLETED', createdAt: now, host: { businessName: 'Host One' } },
      ]);

      const result = await service.getSystemLogs({ page: 1, limit: 10, search: 'alice' });
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
    });
  });
});
