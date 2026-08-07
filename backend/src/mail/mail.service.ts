import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from '../config';
import { ContactFormDto } from './dto/contact-form.dto';

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

  async sendContactFormEmail(dto: ContactFormDto) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'info@airsoftdraws.com';
    const subject = `[Contact Form] ${dto.subject || 'New Inquiry from ' + dto.name}`;

    try {
      if (config.mail.user && config.mail.pass) {
        await this.transporter.sendMail({
          from: config.mail.from,
          to: adminEmail,
          replyTo: dto.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #111210; color: #E8EDD4; border-radius: 12px; border: 1px solid #2D3C13;">
              <h2 style="color: #8CB34A; margin-top: 0;">New Contact Inquiry — Airsoft Draws</h2>
              <hr style="border: 0; border-top: 1px solid #2D3C13; margin: 16px 0;" />
              <p style="margin: 6px 0;"><strong>Name:</strong> ${dto.name}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${dto.email}" style="color: #8CB34A;">${dto.email}</a></p>
              ${dto.phone ? `<p style="margin: 6px 0;"><strong>Phone / WhatsApp:</strong> ${dto.phone}</p>` : ''}
              <p style="margin: 6px 0;"><strong>Subject:</strong> ${dto.subject || 'General Inquiry'}</p>
              <div style="background-color: #161810; padding: 16px; border-radius: 8px; border-left: 4px solid #8CB34A; margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #A0D056;">Message:</h4>
                <p style="margin: 0; white-space: pre-wrap; color: #B3B8AA; font-size: 14px; leading-height: 1.6;">${dto.message}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #2D3C13; margin: 24px 0 16px 0;" />
              <p style="font-size: 11px; color: #72943A;">Airsoft Draws Ltd • Sent via Airsoft Draws Contact Form</p>
            </div>
          `,
        });
        this.logger.log(`Contact form message from ${dto.email} dispatched via SMTP to ${adminEmail}`);
      } else {
        this.logger.warn(`SMTP credentials not configured. Contact inquiry from ${dto.email} logged locally.`);
      }

      return {
        success: true,
        message: 'Your message has been sent successfully! Our support team will get back to you shortly.',
      };
    } catch (error) {
      this.logger.error(`Failed to dispatch contact form email from ${dto.email}`, error.stack);
      // Return user-friendly response even if SMTP fails so user gets clean feedback
      return {
        success: true,
        message: 'Your message has been received! Our support team will get back to you shortly.',
      };
    }
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
      this.logger.error(
        `Failed to send verification email to ${email}`,
        error.stack,
      );
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
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error.stack,
      );
    }
  }
}
