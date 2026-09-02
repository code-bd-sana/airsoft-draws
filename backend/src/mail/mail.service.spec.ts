import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let mockTransporter: { sendMail: jest.Mock };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'msg-1' }),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendContactFormEmail', () => {
    it('should send email and return success message', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        subject: 'Inquiry',
        message: 'Hello Support',
      };

      const result = await service.sendContactFormEmail(dto);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Your message has been');
    });

    it('should catch transporter errors and return user-friendly message', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP failure'));

      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello Support',
      };

      const result = await service.sendContactFormEmail(dto);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Your message has been received');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email without throwing', async () => {
      await expect(
        service.sendVerificationEmail('test@test.com', 'token123'),
      ).resolves.not.toThrow();
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should handle sendMail error gracefully', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP down'));
      await expect(
        service.sendVerificationEmail('test@test.com', 'token123'),
      ).resolves.not.toThrow();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email without throwing', async () => {
      await expect(
        service.sendPasswordResetEmail('test@test.com', 'reset123'),
      ).resolves.not.toThrow();
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should handle error gracefully', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP down'));
      await expect(
        service.sendPasswordResetEmail('test@test.com', 'reset123'),
      ).resolves.not.toThrow();
    });
  });
});
