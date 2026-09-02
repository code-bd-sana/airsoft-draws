import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService, calculateAge } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { RafflesService } from '../raffles/raffles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('TicketsService', () => {
  let service: TicketsService;
  let mockPrisma: MockPrismaService;
  let mockRafflesService: { drawWinner: jest.Mock };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockRafflesService = {
      drawWinner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RafflesService, useValue: mockRafflesService },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    process.env.USE_TEST_PAYMENT = 'true';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateAge helper', () => {
    it('should calculate age correctly', () => {
      const dob = new Date('2000-01-01');
      const ref = new Date('2026-01-01');
      expect(calculateAge(dob, ref)).toBe(26);
    });

    it('should adjust age if birthday has not passed this year', () => {
      const dob = new Date('2000-12-31');
      const ref = new Date('2026-06-01');
      expect(calculateAge(dob, ref)).toBe(25);
    });
  });

  describe('allocateTicketsInDatabase / purchaseTickets', () => {
    it('should throw BadRequestException if quantity <= 0', async () => {
      await expect(service.purchaseTickets('u-1', 'r-1', 0)).rejects.toThrow(
        'Quantity must be at least 1',
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if raffle does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });
      mockPrisma.raffle.findUnique.mockResolvedValue(null);

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if raffle is not active', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ENDED',
        ticketsSold: 0,
        totalTickets: 100,
      });

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow('This competition is not active');
    });

    it('should throw BadRequestException if requested tickets exceed remaining', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        ticketsSold: 95,
        totalTickets: 100,
      });

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 10 }),
      ).rejects.toThrow('Only 5 tickets remaining');
    });

    it('should throw BadRequestException if under 18 years old', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('2015-01-01'),
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        ticketsSold: 0,
        totalTickets: 100,
      });

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow('Eligibility is restricted to participants aged 18 years or older');
    });

    it('should throw BadRequestException for RIF competition without UKARA', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: null,
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        prizeClassification: 'RIF',
        ticketsSold: 0,
        totalTickets: 100,
      });

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow('A valid UKARA registration number is required');
    });

    it('should allocate tickets, create transaction, and detect instant wins', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: 'UKARA123',
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        hostId: 'hp-1',
        status: 'ACTIVE',
        prizeClassification: 'RIF',
        ticketsSold: 0,
        totalTickets: 10,
        pricePerTicket: '5.00',
        instantWins: [
          { ticketNumber: 1, prizeName: 'Instant Glock', rrpValue: '100.00' },
        ],
      });
      mockPrisma.ticket.findMany.mockResolvedValue([]);
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-1' });
      mockPrisma.ticket.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.raffle.update.mockResolvedValue({ id: 'r-1', ticketsSold: 1, isAutoDraw: false, totalTickets: 10 });
      mockPrisma.hostProfile.update.mockResolvedValue({ id: 'hp-1' });

      const result = await service.allocateTicketsInDatabase('u-1', 'r-1', {
        quantity: 1,
        acceptedTerms: true,
      });

      expect(result.message).toBe('Tickets purchased successfully');
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
      expect(mockPrisma.ticket.createMany).toHaveBeenCalled();
    });
  });

  describe('getUserTickets', () => {
    it('should return mapped tickets for user', async () => {
      mockPrisma.ticket.findMany.mockResolvedValue([
        {
          id: 't-1',
          ticketNumber: 5,
          createdAt: new Date(),
          raffle: {
            id: 'r-1',
            title: 'M4 Raffle',
            slug: 'm4-raffle',
            mainImage: 'm4.jpg',
            pricePerTicket: '5.00',
            status: 'ACTIVE',
            instantWins: [],
          },
        },
      ]);

      const tickets = await service.getUserTickets('u-1');
      expect(tickets).toHaveLength(1);
      expect(tickets[0].ticketNumber).toBe(5);
      expect(tickets[0].raffle.title).toBe('M4 Raffle');
    });
  });
});
