import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException({ message: 'Validation failed', error: [{ field: 'email', errors: ['Email is already in use'] }] });
    }

    const role = registerDto.role || 'CLIENT';

    if (role === 'HOST' && !registerDto.businessName) {
      throw new BadRequestException('Business name is required for host registration');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          location: registerDto.location,
          role,
        },
      });

      if (role === 'HOST') {
        await prisma.hostProfile.create({
          data: {
            userId: newUser.id,
            businessName: registerDto.businessName!,
          },
        });
      }

      return newUser;
    });

    // Generate email verification token (expires in 24h)
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'VERIFY_EMAIL' },
      { expiresIn: '24h' }
    );

    // Send email without awaiting, so it doesn't block the request
    this.mailService.sendVerificationEmail(user.email, verificationToken);

    return {
      userId: user.id,
      email: user.email,
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    // Auth token (expires in 7d as requested)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { passwordHash, ...userWithoutPassword } = user;

      return { user: userWithoutPassword };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const payload = this.jwtService.verify(verifyEmailDto.token);
      
      if (payload.type !== 'VERIFY_EMAIL') {
        throw new BadRequestException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isEmailVerified) {
        return { message: 'Email is already verified' };
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      return { message: 'Email successfully verified' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async resendVerification(resendVerificationDto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendVerificationDto.email },
    });

    if (!user) {
      // Do not reveal if the user exists for security purposes
      return { message: 'If an account with that email exists, a verification link has been sent.' };
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }

    // Generate email verification token (expires in 24h)
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'VERIFY_EMAIL' },
      { expiresIn: '24h' }
    );

    this.mailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'If an account with that email exists, a verification link has been sent.' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Do not reveal if the user exists for security purposes
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Generate reset token (expires in 1h)
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'RESET_PASSWORD' },
      { expiresIn: '1h' }
    );

    this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(resetPasswordDto.token);
      
      if (payload.type !== 'RESET_PASSWORD') {
        throw new BadRequestException('Invalid token type');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, salt);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { message: 'Password has been successfully reset. You can now login.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }
}
