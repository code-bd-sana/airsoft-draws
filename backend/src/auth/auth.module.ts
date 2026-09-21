import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRateLimiterService } from './auth-rate-limiter.service';
import { config } from '../config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.security.jwtSecret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRateLimiterService],
  exports: [AuthService, AuthRateLimiterService],
})
export class AuthModule {}
