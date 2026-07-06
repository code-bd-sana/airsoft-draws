import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from '../config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465, // true for 465, false for other ports
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${config.frontend.url}/verify-email?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: config.mail.from,
        to: email,
        subject: 'Verify your email - Airsoft Draws',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Welcome to Airsoft Draws!</h2>
            <p>Please click the button below to verify your email address and activate your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
            </div>
            <p>Or copy this link to your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error.stack);
      // In production, we might want to throw or handle this gracefully
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${config.frontend.url}/reset-password?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: config.mail.from,
        to: email,
        subject: 'Reset your password - Airsoft Draws',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to choose a new one:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            <p>Or copy this link to your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error.stack);
    }
  }
}
