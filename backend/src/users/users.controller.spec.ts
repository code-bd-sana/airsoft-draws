import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: {
    getMyWinners: jest.Mock;
    changePassword: jest.Mock;
    updateProfile: jest.Mock;
    updateAvatar: jest.Mock;
  };
  let mockJwtService: { verify: jest.Mock };

  beforeEach(async () => {
    mockUsersService = {
      getMyWinners: jest.fn(),
      changePassword: jest.fn(),
      updateProfile: jest.fn(),
      updateAvatar: jest.fn(),
    };
    mockJwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  const createMockRequest = (token?: string): Request =>
    ({
      cookies: token ? { accessToken: token } : {},
      headers: { host: 'localhost:5000' },
      protocol: 'http',
    }) as unknown as Request;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyWinners', () => {
    it('should throw UnauthorizedException if no cookie', async () => {
      const req = createMockRequest();
      await expect(controller.getMyWinners(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return winners for current user', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockUsersService.getMyWinners.mockResolvedValue([{ id: 'w-1' }]);

      const result = await controller.getMyWinners(req);
      expect(mockUsersService.getMyWinners).toHaveBeenCalledWith('u-1');
      expect(result).toEqual([{ id: 'w-1' }]);
    });
  });

  describe('changePassword', () => {
    it('should delegate to usersService.changePassword', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockUsersService.changePassword.mockResolvedValue({ message: 'ok' });

      const dto = { currentPassword: 'old', newPassword: 'new' };
      const result = await controller.changePassword(req, dto);

      expect(mockUsersService.changePassword).toHaveBeenCalledWith('u-1', dto);
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('updateProfile', () => {
    it('should delegate to usersService.updateProfile', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockUsersService.updateProfile.mockResolvedValue({ message: 'ok' });

      const dto = { firstName: 'Jane' };
      const result = await controller.updateProfile(req, dto);

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('u-1', dto);
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('uploadAvatar', () => {
    it('should throw BadRequestException if file is missing', async () => {
      const req = createMockRequest('valid-token');
      await expect(controller.uploadAvatar(req, null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should construct URL and update avatar', async () => {
      const req = createMockRequest('valid-token');
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockUsersService.updateAvatar.mockResolvedValue({
        message: 'Avatar uploaded successfully',
      });

      const file = { filename: 'avatar123.png' } as Express.Multer.File;
      const result = await controller.uploadAvatar(req, file);

      expect(mockUsersService.updateAvatar).toHaveBeenCalledWith(
        'u-1',
        expect.stringContaining('/uploads/avatars/avatar123.png'),
      );
      expect(result.message).toBe('Avatar uploaded successfully');
    });
  });
});
