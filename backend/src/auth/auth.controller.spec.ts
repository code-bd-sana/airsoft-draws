import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: {
    register: jest.Mock;
    login: jest.Mock;
    verifyToken: jest.Mock;
    verifyEmail: jest.Mock;
    resendVerification: jest.Mock;
    forgotPassword: jest.Mock;
    resetPassword: jest.Mock;
  };

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      verifyToken: jest.fn(),
      verifyEmail: jest.fn(),
      resendVerification: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should delegate registration to authService', async () => {
      const dto = { email: 'test@example.com', password: 'Password123!' };
      mockAuthService.register.mockResolvedValue({ userId: 'u-1', message: 'ok' });

      const result = await controller.register(dto);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result.userId).toBe('u-1');
    });
  });

  describe('login', () => {
    it('should set cookie and return user payload', async () => {
      const dto = { email: 'test@example.com', password: 'Password123!' };
      const user = { id: 'u-1', email: 'test@example.com' };
      mockAuthService.login.mockResolvedValue({
        accessToken: 'mock-token',
        user,
      });

      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.login(dto, res);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'mock-token',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      expect(result).toEqual({ user });
    });
  });

  describe('logout', () => {
    it('should clear accessToken cookie and return success message', async () => {
      const res = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.logout(res);
      expect(res.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('getMe', () => {
    it('should throw UnauthorizedException if cookie is missing', async () => {
      const req = { cookies: {} } as unknown as Request;
      await expect(controller.getMe(req)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user from verifyToken when cookie is present', async () => {
      const req = { cookies: { accessToken: 'valid-token' } } as unknown as Request;
      const expectedUser = { user: { id: 'u-1', email: 'test@example.com' } };
      mockAuthService.verifyToken.mockResolvedValue(expectedUser);

      const result = await controller.getMe(req);
      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(expectedUser);
    });
  });

  describe('verifyEmail', () => {
    it('should delegate to authService.verifyEmail', async () => {
      mockAuthService.verifyEmail.mockResolvedValue({ message: 'Verified' });
      const result = await controller.verifyEmail({ token: 't1' });
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith({ token: 't1' });
      expect(result.message).toBe('Verified');
    });
  });

  describe('resendVerification', () => {
    it('should delegate to authService.resendVerification', async () => {
      mockAuthService.resendVerification.mockResolvedValue({ message: 'Sent' });
      const result = await controller.resendVerification({ email: 'a@b.com' });
      expect(mockAuthService.resendVerification).toHaveBeenCalledWith({ email: 'a@b.com' });
      expect(result.message).toBe('Sent');
    });
  });

  describe('forgotPassword', () => {
    it('should delegate to authService.forgotPassword', async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'Reset sent' });
      const result = await controller.forgotPassword({ email: 'a@b.com' });
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith({ email: 'a@b.com' });
      expect(result.message).toBe('Reset sent');
    });
  });

  describe('resetPassword', () => {
    it('should delegate to authService.resetPassword', async () => {
      mockAuthService.resetPassword.mockResolvedValue({ message: 'Password reset' });
      const result = await controller.resetPassword({
        token: 't',
        newPassword: 'pass',
      });
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith({
        token: 't',
        newPassword: 'pass',
      });
      expect(result.message).toBe('Password reset');
    });
  });
});
