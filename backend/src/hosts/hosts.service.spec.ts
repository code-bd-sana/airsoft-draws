import { Test, TestingModule } from '@nestjs/testing';
import { HostsService } from './hosts.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('HostsService', () => {
  let service: HostsService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<HostsService>(HostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllVerifiedPublic', () => {
    it('should return mapped verified hosts', async () => {
      mockPrisma.hostProfile.findMany.mockResolvedValue([
        {
          id: 'hp-1',
          slug: 'airsoft-club',
          businessName: 'Airsoft Club',
          isVerified: true,
          user: { firstName: 'Bob', lastName: 'Host', avatarUrl: 'http://avatar.png' },
          _count: { raffles: 3 },
        },
      ]);

      const result = await service.findAllVerifiedPublic();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Airsoft Club');
      expect(result[0].competitionCount).toBe(3);
    });
  });

  describe('findOnePublic', () => {
    it('should throw NotFoundException if host not found', async () => {
      mockPrisma.hostProfile.findFirst.mockResolvedValue(null);

      await expect(service.findOnePublic('unknown-slug')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return host profile with mapped raffles and instant wins', async () => {
      mockPrisma.hostProfile.findFirst.mockResolvedValue({
        id: 'hp-1',
        slug: 'tactical-draws',
        businessName: 'Tactical Draws',
        isVerified: true,
        createdAt: new Date('2023-01-01'),
        user: { firstName: 'Host', lastName: 'One', avatarUrl: 'avatar.png' },
        _count: { raffles: 5 },
        raffles: [
          {
            id: 'r-1',
            title: 'M4 Competition',
            slug: 'm4-competition',
            description: 'Win an M4',
            mainImage: 'm4.jpg',
            pricePerTicket: '5.00',
            totalTickets: 100,
            ticketsSold: 50,
            endDate: new Date('2026-12-31'),
            status: 'ACTIVE',
            instantWins: [{ id: 'iw-1' }],
          },
        ],
      });

      const result = await service.findOnePublic('tactical-draws');
      expect(result.id).toBe('hp-1');
      expect(result.drawsHosted).toBe(5);
      expect(result.raffles[0].isInstantWin).toBe(true);
      expect(result.raffles[0].ticketPrice).toBe(5);
    });
  });

  describe('getHostProfileByUserId', () => {
    it('should throw NotFoundException if host profile does not exist', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);

      await expect(service.getHostProfileByUserId('u-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return host profile', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1', userId: 'u-1' });

      const result = await service.getHostProfileByUserId('u-1');
      expect(result.id).toBe('hp-1');
    });
  });

  describe('getWalletStats', () => {
    it('should calculate available balance, pending clearance, and earnings', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        userId: 'u-1',
        walletBalance: '150.00',
      });
      mockPrisma.withdrawal.aggregate
        .mockResolvedValueOnce({ _sum: { amount: '50.00' } }) // pending
        .mockResolvedValueOnce({ _sum: { amount: '100.00' } }); // completed
      mockPrisma.raffle.findMany.mockResolvedValue([
        { pricePerTicket: '10.00', ticketsSold: 20 },
      ]);

      const result = await service.getWalletStats('u-1');
      expect(result.availableBalance).toBe(150);
      expect(result.pendingClearance).toBe(50);
      expect(result.totalLifetimeEarnings).toBe(200);
      expect(result.totalFeesPaid).toBe(10);
    });
  });

  describe('requestWithdrawal', () => {
    it('should throw BadRequestException if amount is zero or negative', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        walletBalance: '100.00',
      });

      await expect(
        service.requestWithdrawal('u-1', {
          amount: 0,
          payoutMethod: 'Bank Transfer',
          payoutDetails: {},
        }),
      ).rejects.toThrow('Withdrawal amount must be greater than 0');
    });

    it('should throw BadRequestException if amount exceeds balance', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        walletBalance: '50.00',
      });

      await expect(
        service.requestWithdrawal('u-1', {
          amount: 100,
          payoutMethod: 'Bank Transfer',
          payoutDetails: {},
        }),
      ).rejects.toThrow('Insufficient wallet balance');
    });

    it('should create withdrawal and transaction successfully', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        walletBalance: '200.00',
      });
      mockPrisma.withdrawal.create.mockResolvedValue({
        id: 'w-1',
        amount: '100.00',
        feeAmount: '10.00',
        netAmount: '90.00',
        payoutMethod: 'Bank Transfer',
        status: 'PENDING',
        createdAt: new Date(),
      });

      const result = await service.requestWithdrawal('u-1', {
        amount: 100,
        payoutMethod: 'Bank Transfer',
        payoutDetails: { accountNumber: '12345678' },
      });

      expect(result.message).toBe('Withdrawal request submitted successfully');
      expect(result.withdrawal.grossAmount).toBe(100);
      expect(result.withdrawal.netAmount).toBe(90);
    });
  });

  describe('getWithdrawalsHistory', () => {
    it('should return mapped withdrawals with parsed details', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.withdrawal.findMany.mockResolvedValue([
        {
          id: 'wd12345678',
          amount: '100.00',
          feeAmount: '10.00',
          netAmount: '90.00',
          payoutMethod: 'Bank Transfer',
          payoutDetails: '{"bank":"Barclays"}',
          status: 'COMPLETED',
          createdAt: new Date('2026-01-01'),
          adminNotes: 'Paid',
        },
      ]);

      const history = await service.getWithdrawalsHistory('u-1');
      expect(history).toHaveLength(1);
      expect(history[0].status).toBe('Paid');
      expect(history[0].payoutDetails).toEqual({ bank: 'Barclays' });
      expect(history[0].referenceId).toBe('WD-WD123456');
    });
  });

  describe('getHostDashboardOverview', () => {
    it('should return full kpi stats, active raffles, and recent activity', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        walletBalance: '300.00',
      });
      mockPrisma.raffle.findMany.mockResolvedValue([
        {
          id: 'r-1',
          title: 'Active Draw',
          status: 'ACTIVE',
          pricePerTicket: '5.00',
          totalTickets: 100,
          ticketsSold: 40,
          endDate: new Date(),
          instantWins: [],
          _count: { tickets: 40, winners: 0 },
        },
      ]);
      mockPrisma.winner.count.mockResolvedValue(2);
      mockPrisma.ticket.findMany.mockResolvedValue([
        {
          id: 't-1',
          ticketNumber: '001',
          createdAt: new Date(),
          user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com' },
          raffle: { title: 'Active Draw', pricePerTicket: '5.00' },
        },
      ]);

      const overview = await service.getHostDashboardOverview('u-1');
      expect(overview.kpiStats.activeCompetitionsCount).toBe(1);
      expect(overview.kpiStats.totalGrossRevenue).toBe(200);
      expect(overview.kpiStats.totalNetRevenue).toBe(180);
      expect(overview.activeRaffles[0].percentageSold).toBe(40);
      expect(overview.recentActivity[0].buyerName).toBe('Alice Smith');
    });
  });
});
