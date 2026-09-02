import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('u-1', {
          currentPassword: 'old',
          newPassword: 'new',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if current password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        passwordHash: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('u-1', {
          currentPassword: 'wrong',
          newPassword: 'new',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update password hash on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        passwordHash: 'oldHash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
      mockPrisma.user.update.mockResolvedValue({ id: 'u-1' });

      const result = await service.changePassword('u-1', {
        currentPassword: 'old',
        newPassword: 'new',
      });

      expect(result.message).toBe('Password updated successfully');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { passwordHash: 'newHash' },
      });
    });
  });

  describe('updateProfile', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('u-1', { firstName: 'John' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update user profile for client', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 'u-1', role: 'CLIENT' })
        .mockResolvedValueOnce({
          id: 'u-1',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'hash',
          role: 'CLIENT',
        });
      mockPrisma.user.update.mockResolvedValue({
        id: 'u-1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CLIENT',
      });

      const result = await service.updateProfile('u-1', {
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.message).toBe('Profile updated successfully');
      expect(result.user.firstName).toBe('John');
      expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('should update host profile when user is HOST', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({
          id: 'h-1',
          role: 'HOST',
          hostProfile: { id: 'hp-1' },
        })
        .mockResolvedValueOnce({
          id: 'h-1',
          role: 'HOST',
          passwordHash: 'hash',
          hostProfile: { id: 'hp-1', businessName: 'Updated Club' },
        });
      mockPrisma.user.update.mockResolvedValue({
        id: 'h-1',
        role: 'HOST',
        hostProfile: { id: 'hp-1' },
      });
      mockPrisma.hostProfile.update.mockResolvedValue({ id: 'hp-1' });

      const result = await service.updateProfile('h-1', {
        businessName: 'Updated Club',
        bio: 'New bio',
      });

      expect(result.message).toBe('Profile updated successfully');
      expect(mockPrisma.hostProfile.update).toHaveBeenCalled();
    });
  });

  describe('updateAvatar', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateAvatar('u-1', 'http://avatar.jpg'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update avatar and return user without password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });
      mockPrisma.user.update.mockResolvedValue({
        id: 'u-1',
        avatarUrl: 'http://avatar.jpg',
        passwordHash: 'hash',
      });

      const result = await service.updateAvatar('u-1', 'http://avatar.jpg');
      expect(result.message).toBe('Avatar updated successfully');
      expect(result.user.avatarUrl).toBe('http://avatar.jpg');
      expect((result.user as any).passwordHash).toBeUndefined();
    });
  });

  describe('getMyWinners', () => {
    it('should return formatted winners including instant wins and main draws', async () => {
      mockPrisma.winner.findMany.mockResolvedValue([
        {
          id: 'w-1',
          raffleId: 'r-1',
          ticketId: 't-1',
          winType: 'MAIN_DRAW',
          deliveryStatus: 'PENDING',
          verificationStatus: 'VERIFIED',
          trackingNumber: null,
          createdAt: new Date(),
          ticket: { ticketNumber: '001', createdAt: new Date() },
          raffle: {
            id: 'r-1',
            title: 'Raffle 1',
            slug: 'raffle-1',
            mainImage: 'main.jpg',
            prizeName: 'M4 Carbine',
            mainPrizeValue: '500.00',
            status: 'ENDED',
            host: { businessName: 'Tactical Draws' },
            instantWins: [],
          },
        },
        {
          id: 'w-2',
          raffleId: 'r-2',
          ticketId: 't-2',
          winType: 'INSTANT_WIN',
          deliveryStatus: 'DELIVERED',
          verificationStatus: 'VERIFIED',
          trackingNumber: 'TRK123',
          createdAt: new Date(),
          ticket: { ticketNumber: '050', createdAt: new Date() },
          raffle: {
            id: 'r-2',
            title: 'Raffle 2',
            slug: 'raffle-2',
            mainImage: 'main2.jpg',
            prizeName: 'Sniper',
            mainPrizeValue: '800.00',
            status: 'ACTIVE',
            host: { businessName: 'Tactical Draws' },
            instantWins: [
              {
                id: 'iw-1',
                ticketNumber: '050',
                prizeName: 'Sidearm',
                image: 'sidearm.jpg',
                rrpValue: '150.00',
              },
            ],
          },
        },
      ]);

      const winners = await service.getMyWinners('u-1');
      expect(winners).toHaveLength(2);
      expect(winners[0].winType).toBe('MAIN_DRAW');
      expect(winners[0].prizeName).toBe('M4 Carbine');
      expect(winners[1].winType).toBe('INSTANT_WIN');
      expect(winners[1].prizeName).toBe('Sidearm');
      expect(winners[1].instantWinDetails?.prizeName).toBe('Sidearm');
    });
  });
});
