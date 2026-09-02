import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: MockPrismaService;
  let mockJwtService: { sign: jest.Mock; verify: jest.Mock };
  let mockMailService: {
    sendVerificationEmail: jest.Mock;
    sendPasswordResetEmail: jest.Mock;
  };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    };
    mockMailService = {
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if email is already in use', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1', email: 'test@example.com' });

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for host without businessName', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.register({
          email: 'host@example.com',
          password: 'Password123!',
          role: 'HOST',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register a client successfully and send verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const createdUser = { id: 'u-1', email: 'test@example.com', role: 'CLIENT' };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toEqual({
        userId: 'u-1',
        email: 'test@example.com',
        message: 'Registration successful. Please check your email to verify your account.',
      });
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'mock-jwt-token',
      );
    });

    it('should register a host with free plan subscription', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const createdUser = { id: 'h-1', email: 'host@example.com', role: 'HOST' };
      mockPrisma.user.create.mockResolvedValue(createdUser);
      mockPrisma.hostProfile.create.mockResolvedValue({ id: 'hp-1', userId: 'h-1' });
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue({
        id: 'plan-free',
        name: 'Free',
        durationDays: 30,
      });
      mockPrisma.hostSubscription.create.mockResolvedValue({ id: 'hs-1' });

      const result = await service.register({
        email: 'host@example.com',
        password: 'Password123!',
        role: 'HOST',
        businessName: 'Airsoft Club',
      });

      expect(result.userId).toBe('h-1');
      expect(mockPrisma.hostSubscription.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is blocked', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'blocked@example.com',
        isBlocked: true,
      });

      await expect(
        service.login({ email: 'blocked@example.com', password: 'Password123!' }),
      ).rejects.toThrow('Your account has been suspended');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'test@example.com',
        passwordHash: 'hash',
        isBlocked: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPassword' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'unverified@example.com',
        passwordHash: 'hash',
        isBlocked: false,
        isEmailVerified: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login({ email: 'unverified@example.com', password: 'Password123!' }),
      ).rejects.toThrow('Please verify your email address');
    });

    it('should throw UnauthorizedException if host is not verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'h-1',
        email: 'host@example.com',
        passwordHash: 'hash',
        isBlocked: false,
        isEmailVerified: true,
        role: 'HOST',
        hostProfile: { isVerified: false },
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login({ email: 'host@example.com', password: 'Password123!' }),
      ).rejects.toThrow('pending admin approval');
    });

    it('should log in successfully and return token and user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'client@example.com',
        passwordHash: 'hash',
        isBlocked: false,
        isEmailVerified: true,
        role: 'CLIENT',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'client@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe('client@example.com');
      expect((result.user as any).passwordHash).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should return user for valid token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'user@example.com',
        isBlocked: false,
        passwordHash: 'hash',
      });

      const result = await service.verifyToken('valid-token');
      expect(result.user.id).toBe('u-1');
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.verifyToken('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1', type: 'VERIFY_EMAIL' });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        isEmailVerified: false,
      });
      mockPrisma.user.update.mockResolvedValue({ id: 'u-1', isEmailVerified: true });

      const result = await service.verifyEmail({ token: 'valid-verify-token' });
      expect(result.message).toBe('Email successfully verified');
    });

    it('should return message if email is already verified', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1', type: 'VERIFY_EMAIL' });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        isEmailVerified: true,
      });

      const result = await service.verifyEmail({ token: 'valid-verify-token' });
      expect(result.message).toBe('Email is already verified');
    });

    it('should throw BadRequestException if token type is incorrect', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1', type: 'WRONG_TYPE' });

      await expect(
        service.verifyEmail({ token: 'wrong-type-token' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendVerification', () => {
    it('should send email if user exists and unverified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'test@example.com',
        isEmailVerified: false,
      });

      const result = await service.resendVerification({ email: 'test@example.com' });
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
      expect(result.message).toContain('verification link has been sent');
    });

    it('should return safe message without sending email if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.resendVerification({ email: 'unknown@example.com' });
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
      expect(result.message).toContain('verification link has been sent');
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email when user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'user@example.com',
        passwordHash: 'somehashedpassword123',
      });

      const result = await service.forgotPassword({ email: 'user@example.com' });
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result.message).toContain('password reset link has been sent');
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token and fragment', async () => {
      const passwordHash = 'current_password_hash_value';
      mockJwtService.verify.mockReturnValue({
        sub: 'u-1',
        type: 'RESET_PASSWORD',
        hashFragment: passwordHash.substring(0, 15),
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        passwordHash,
      });
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockPrisma.user.update.mockResolvedValue({ id: 'u-1' });

      const result = await service.resetPassword({
        token: 'reset-token',
        newPassword: 'NewPassword123!',
      });

      expect(result.message).toContain('Password has been successfully reset');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: { passwordHash: 'newHashedPassword' },
      });
    });

    it('should throw BadRequestException if hashFragment has changed', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'u-1',
        type: 'RESET_PASSWORD',
        hashFragment: 'old_hash_fragme',
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        passwordHash: 'new_different_password_hash',
      });

      await expect(
        service.resetPassword({
          token: 'stale-token',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
