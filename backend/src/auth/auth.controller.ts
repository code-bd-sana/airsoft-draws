import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { FileUploadDto } from '../common/dto/file-upload.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('upload-logo')
  @ApiOperation({
    summary: 'Upload host logo or avatar during onboarding',
    description: 'Uploads an image file to ./uploads/avatars and returns its public URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or file missing' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  async uploadLogo(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host =
      req.headers['x-forwarded-host'] || req.headers.host || '127.0.0.1:5000';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;
    return { avatarUrl, message: 'Logo uploaded successfully' };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers a new CLIENT or HOST user account with secure credentials.',
  })
  @ApiResponse({ status: 201, description: 'User successfully registered. Verification email dispatched.' })
  @ApiResponse({ status: 400, description: 'Validation error in request payload' })
  @ApiResponse({ status: 409, description: 'Email address is already registered' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user and set session cookie',
    description: 'Authenticates user credentials and sets an HTTP-only accessToken cookie.',
  })
  @ApiResponse({ status: 200, description: 'User successfully authenticated and cookie issued' })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or unverified email address',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user and clear session cookie',
    description: 'Clears the accessToken cookie and terminates the session.',
  })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get current user profile from token or cookie',
    description: 'Validates current authentication token and returns user profile details.',
  })
  @ApiResponse({ status: 200, description: 'Active user profile details' })
  @ApiResponse({ status: 401, description: 'Missing or expired authentication token' })
  async getMe(@Req() req: Request) {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }
    return this.authService.verifyToken(token);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user email using token',
    description: 'Confirms email address using the one-time token received via email.',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Dispatches a new verification token to the provided email address.',
  })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  async resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.authService.resendVerification(resendVerificationDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send password reset email',
    description: 'Sends a secure password reset link to the registered email address.',
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent if account exists' })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password using token',
    description: 'Updates account password with the provided reset token.',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

