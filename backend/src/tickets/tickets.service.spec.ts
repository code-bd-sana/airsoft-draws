import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService, calculateAge } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { RafflesService } from '../raffles/raffles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

import { NotificationsService } from '../notifications/notifications.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let mockPrisma: MockPrismaService;
  let mockRafflesService: { drawWinner: jest.Mock };
  let mockNotificationsService: { createNotification: jest.Mock; notifyAdmins: jest.Mock };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockRafflesService = {
      drawWinner: jest.fn(),
    };
    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue({ id: 'notif-1' }),
      notifyAdmins: jest.fn().mockResolvedValue({ count: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RafflesService, useValue: mockRafflesService },
        { provide: NotificationsService, useValue: mockNotificationsService },
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

    it('should throw BadRequestException if requested tickets is below minTickets', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: 'UKARA123',
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        ticketsSold: 0,
        totalTickets: 100,
        minTickets: 5,
        maxTickets: 20,
      });

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 2 }),
      ).rejects.toThrow('You must purchase at least 5 ticket(s) for this competition.');
    });

    it('should throw BadRequestException if requested tickets exceeds maxTickets per entrant', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: 'UKARA123',
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        ticketsSold: 0,
        totalTickets: 100,
        minTickets: 1,
        maxTickets: 10,
      });
      mockPrisma.ticket.count.mockResolvedValue(8);

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 5 }),
      ).rejects.toThrow('You can only purchase up to 2 more ticket(s) for this competition');
    });

    it('should throw BadRequestException if user already reached maxTickets', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: 'UKARA123',
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        status: 'ACTIVE',
        ticketsSold: 0,
        totalTickets: 100,
        minTickets: 1,
        maxTickets: 10,
      });
      mockPrisma.ticket.count.mockResolvedValue(10);

      await expect(
        service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 }),
      ).rejects.toThrow('You have already reached the maximum ticket limit (10) for this competition.');
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

    it('should dispatch notifications to buyer and host on ticket purchase and instant win', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        dateOfBirth: new Date('1990-01-01'),
        ukaraNumber: 'UKARA123',
      });
      mockPrisma.raffle.findUnique.mockResolvedValue({
        id: 'r-1',
        title: 'Glock Raffle',
        status: 'ACTIVE',
        ticketsSold: 0,
        totalTickets: 100,
        pricePerTicket: '10.00',
        instantWins: [
          {
            id: 'iw-1',
            ticketNumber: 1,
            prizeName: 'Bonus Magazine',
            isClaimed: false,
          },
        ],
        hostId: 'h-1',
        host: { userId: 'host-user-1' },
      });
      mockPrisma.ticket.findMany.mockResolvedValue([
        { id: 't-1', ticketNumber: 1 },
      ]);
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-1' });
      mockPrisma.ticket.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.raffle.update.mockResolvedValue({
        id: 'r-1',
        title: 'Glock Raffle',
        ticketsSold: 1,
        totalTickets: 100,
        status: 'ACTIVE',
        isAutoDraw: false,
      });
      mockPrisma.instantWin.update.mockResolvedValue({ id: 'iw-1' });
      mockPrisma.winner.create.mockResolvedValue({
        id: 'w-1',
        prizeName: 'Bonus Magazine',
        ticketId: 't-1',
      });

      await service.allocateTicketsInDatabase('u-1', 'r-1', { quantity: 1 });

      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u-1',
          type: 'PAYMENT',
          title: 'Ticket Purchase Confirmed',
        }),
      );
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'host-user-1',
          type: 'PAYMENT',
          title: 'New Ticket Sale',
        }),
      );
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u-1',
          type: 'WIN',
          title: '🎉 Instant Win Prize Claimed!',
        }),
      );
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'host-user-1',
          type: 'WIN',
          title: 'Instant Win Hit on Competition',
        }),
      );
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

  describe('checkout (multi-raffle)', () => {
    it('should throw BadRequestException if items array is empty', async () => {
      await expect(
        service.checkout('u-1', { items: [] } as any),
      ).rejects.toThrow('Basket must contain at least one item');
    });

    it('should throw BadRequestException if user is under 18', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        isBlocked: false,
      });

      const today = new Date();
      const under18Dob = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
        .toISOString()
        .slice(0, 10);

      await expect(
        service.checkout('u-1', {
          items: [{ raffleId: 'r-1', quantity: 1 }],
          dateOfBirth: under18Dob,
          acceptedTerms: true,
        } as any),
      ).rejects.toThrow('Eligibility is restricted to participants aged 18 years or older');
    });

    it('should throw BadRequestException if UKARA missing for RIF raffle', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        isBlocked: false,
        ukaraNumber: null,
      });
      mockPrisma.raffle.findMany.mockResolvedValue([
        {
          id: 'r-1',
          title: 'RIF Sniper',
          status: 'ACTIVE',
          prizeClassification: 'RIF',
          ticketsSold: 0,
          totalTickets: 100,
          pricePerTicket: '10.00',
        },
      ]);

      await expect(
        service.checkout('u-1', {
          items: [{ raffleId: 'r-1', quantity: 1 }],
          dateOfBirth: '1990-01-01',
          acceptedTerms: true,
          shippingAddress: {
            addressLine1: 'Street 1',
            city: 'London',
            postalCode: 'SW1',
            country: 'United Kingdom',
          },
        } as any),
      ).rejects.toThrow('A valid UKARA registration number is required');
    });

    it('should successfully allocate tickets across multiple competitions and update profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        isBlocked: false,
        ukaraNumber: 'UKARA999',
      });
      mockPrisma.raffle.findMany.mockResolvedValue([
        {
          id: 'r-1',
          title: 'RIF M4',
          status: 'ACTIVE',
          prizeClassification: 'RIF',
          ticketsSold: 0,
          totalTickets: 50,
          pricePerTicket: '5.00',
          instantWins: [],
        },
        {
          id: 'r-2',
          title: 'Tactical Vest',
          status: 'ACTIVE',
          prizeClassification: 'ACCESSORY',
          ticketsSold: 0,
          totalTickets: 50,
          pricePerTicket: '2.50',
          instantWins: [],
        },
      ]);
      mockPrisma.user.update.mockResolvedValue({ id: 'u-1' });
      mockPrisma.transaction.create.mockResolvedValue({ id: 'tx-basket-1' });
      mockPrisma.ticket.findMany.mockResolvedValue([]);
      mockPrisma.ticket.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.raffle.update.mockResolvedValue({
        id: 'r-1',
        ticketsSold: 2,
        isAutoDraw: false,
        totalTickets: 50,
      });

      const result = await service.checkout('u-1', {
        items: [
          { raffleId: 'r-1', quantity: 2 },
          { raffleId: 'r-2', quantity: 1 },
        ],
        firstName: 'Jade',
        lastName: 'Weeks',
        email: 'jade@example.com',
        phone: '+44 7700 900000',
        dateOfBirth: '1995-05-15',
        shippingAddress: {
          addressLine1: '573 South Oak Lane',
          city: 'London',
          postalCode: 'SW1A 1AA',
          country: 'United Kingdom',
        },
        ukaraNumber: 'UKARA999',
        acceptedTerms: true,
      });

      const resObj = result as any;
      expect(resObj.message).toBe('Basket checkout completed successfully');
      expect(resObj.totalAmount).toBe(12.5); // (5 * 2) + (2.5 * 1) = 12.5
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
    });
  });
});
