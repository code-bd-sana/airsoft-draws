import { Test, TestingModule } from '@nestjs/testing';
import { RafflesService } from './raffles.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('RafflesService', () => {
  let service: RafflesService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RafflesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RafflesService>(RafflesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if host not found', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue(null);

      await expect(service.create('u-1', { title: 'Raffle 1' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException if host has no active subscription', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        subscriptions: [],
      });

      await expect(service.create('u-1', { title: 'Raffle 1' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if maxActiveRaffles limit is exceeded', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        subscriptions: [
          {
            status: 'ACTIVE',
            plan: { name: 'Free', maxActiveRaffles: 1 },
          },
        ],
      });
      mockPrisma.raffle.count.mockResolvedValue(1);

      await expect(service.create('u-1', { title: 'Raffle 2' })).rejects.toThrow(
        'maximum active competitions limit (1)',
      );
    });

    it('should throw ForbiddenException if Instant Wins are added on Free plan', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        subscriptions: [
          {
            status: 'ACTIVE',
            plan: { name: 'Free', price: '0.00', maxActiveRaffles: 1 },
          },
        ],
      });
      mockPrisma.raffle.count.mockResolvedValue(0);
      mockPrisma.raffle.create.mockResolvedValue({ id: 'r-1', title: 'Free Raffle' });

      await expect(
        service.create('u-1', {
          title: 'Free Raffle',
          startDate: new Date(),
          endDate: new Date(),
          totalTickets: 100,
          instantWins: [{ prizeName: 'Gun' }],
        }),
      ).rejects.toThrow('Instant Wins feature is not available on the Free plan');
    });

    it('should create raffle and instant wins successfully for Premium plan', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({
        id: 'hp-1',
        subscriptions: [
          {
            status: 'ACTIVE',
            plan: { name: 'Premium', price: '29.00', maxActiveRaffles: 3 },
          },
        ],
      });
      mockPrisma.raffle.count.mockResolvedValue(1);
      mockPrisma.raffle.create.mockResolvedValue({ id: 'r-1', title: 'Premium Raffle' });
      mockPrisma.instantWin.createMany.mockResolvedValue({ count: 1 });

      const result = await service.create('u-1', {
        title: 'Premium Raffle',
        startDate: new Date(),
        endDate: new Date(),
        totalTickets: 100,
        ticketPrice: 5,
        instantWins: [{ prizeName: 'Pistol', rrpValue: 100 }],
      });

      expect(result.id).toBe('r-1');
      expect(mockPrisma.instantWin.createMany).toHaveBeenCalled();
    });
  });

  describe('updateMainImage', () => {
    it('should throw NotFoundException if raffle not found for host', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.raffle.findFirst.mockResolvedValue(null);

      await expect(
        service.updateMainImage('r-1', 'u-1', 'http://img.jpg'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update main image successfully', async () => {
      mockPrisma.hostProfile.findUnique.mockResolvedValue({ id: 'hp-1' });
      mockPrisma.raffle.findFirst.mockResolvedValue({ id: 'r-1' });
      mockPrisma.raffle.update.mockResolvedValue({ id: 'r-1', mainImage: 'http://img.jpg' });

      const result = await service.updateMainImage('r-1', 'u-1', 'http://img.jpg');
      expect(result.mainImage).toBe('http://img.jpg');
    });
  });

  describe('drawWinner', () => {
    it('should throw NotFoundException if raffle not found', async () => {
      mockPrisma.raffle.findUnique.mockResolvedValue(null);

      await expect(service.drawWinner('r-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if raffle has no sold tickets', async () => {
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        title: 'Raffle 1',
        winners: [],
        tickets: [],
      });

      await expect(service.drawWinner('r-1')).rejects.toThrow(
        'Cannot draw a winner because no tickets have been sold yet',
      );
    });

    it('should select winner and mark raffle as ENDED', async () => {
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        title: 'M4 Raffle',
        mainPrizeValue: '500.00',
        prizeName: 'M4',
        winners: [],
        tickets: [
          { id: 't-1', ticketNumber: 1, userId: 'u-winner' },
          { id: 't-2', ticketNumber: 2, userId: 'u-other' },
        ],
      });
      mockPrisma.winner.create.mockResolvedValue({
        id: 'w-1',
        ticketId: 't-1',
        userId: 'u-winner',
      });
      mockPrisma.raffle.update.mockResolvedValue({ id: 'r-1', status: 'ENDED' });

      const result = await service.drawWinner('r-1', 1);
      expect(mockPrisma.winner.create).toHaveBeenCalled();
      expect(mockPrisma.raffle.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'ENDED' }),
        }),
      );
    });
  });

  describe('updateWinnerDeliveryStatus', () => {
    it('should throw NotFoundException if winner not found', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue(null);

      await expect(
        service.updateWinnerDeliveryStatus('w-1', 'DISPATCHED', 'TRK123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update delivery status and tracking number', async () => {
      mockPrisma.winner.findUnique.mockResolvedValue({ id: 'w-1' });
      mockPrisma.winner.update.mockResolvedValue({
        id: 'w-1',
        deliveryStatus: 'DISPATCHED',
        trackingNumber: 'TRK123',
      });

      const result = await service.updateWinnerDeliveryStatus(
        'w-1',
        'DISPATCHED',
        'TRK123',
      );
      expect(result.deliveryStatus).toBe('DISPATCHED');
    });
  });

  describe('admin operations', () => {
    it('should approve a pending raffle', async () => {
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'PENDING_APPROVAL',
      });
      mockPrisma.raffle.update.mockResolvedValue({ id: 'r-1', status: 'ACTIVE' });

      const result = await service.approve('r-1');
      expect(result.status).toBe('ACTIVE');
    });

    it('should delete raffle as admin', async () => {
      mockPrisma.raffle.findUnique.mockResolvedValue({ id: 'r-1' });
      mockPrisma.raffle.delete.mockResolvedValue({ id: 'r-1' });

      const result = await service.adminDelete('r-1');
      expect(result.id).toBe('r-1');
    });
  });
});
