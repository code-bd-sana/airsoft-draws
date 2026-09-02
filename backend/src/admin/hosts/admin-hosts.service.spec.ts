import { Test, TestingModule } from '@nestjs/testing';
import { AdminHostsService } from './admin-hosts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../test-utils/prisma-mock';

describe('AdminHostsService', () => {
  let service: AdminHostsService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminHostsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminHostsService>(AdminHostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHosts', () => {
    it('should return paginated and formatted hosts', async () => {
      mockPrisma.hostProfile.findMany.mockResolvedValue([
        {
          id: 'hp-1',
          userId: 'u-1',
          businessName: 'Apex Airsoft',
          isVerified: true,
          walletBalance: '250.00',
          createdAt: new Date(),
          user: { email: 'apex@test.com', isBlocked: false },
          subscriptions: [{ plan: { name: 'Premium' } }],
          _count: { raffles: 3 },
        },
      ]);
      mockPrisma.hostProfile.count.mockResolvedValue(1);

      const result = await service.getHosts(1, 10, 'Apex', 'Active');
      expect(result.hosts).toHaveLength(1);
      expect(result.hosts[0].plan).toBe('Premium');
      expect(result.hosts[0].revenue).toBe(250);
      expect(result.total).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should aggregate host counts', async () => {
      mockPrisma.hostProfile.count
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(15) // active
        .mockResolvedValueOnce(2) // blocked
        .mockResolvedValueOnce(3); // pending

      const stats = await service.getStats();
      expect(stats.totalHosts).toBe(20);
      expect(stats.activeHosts).toBe(15);
      expect(stats.blockedHosts).toBe(2);
      expect(stats.pendingHosts).toBe(3);
    });
  });

  describe('approveHost', () => {
    it('should throw NotFoundException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      await expect(service.approveHost('hp-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should verify host profile', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.hostProfile.update.mockResolvedValue({
        id: 'hp-1',
        isVerified: true,
      });

      const result = await service.approveHost('hp-1');
      expect(result.isVerified).toBe(true);
    });
  });

  describe('rejectHost', () => {
    it('should throw NotFoundException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);
      await expect(service.rejectHost('hp-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete subscriptions, delete host profile, and demote user role', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        userId: 'u-1',
      });
      mockPrisma.hostSubscription.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.hostProfile.delete.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.user.update.mockResolvedValue({ id: 'u-1', role: 'CLIENT' });

      await service.rejectHost('hp-1');
      expect(mockPrisma.hostSubscription.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.hostProfile.delete).toHaveBeenCalled();
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { role: 'CLIENT' },
      });
    });
  });
});
