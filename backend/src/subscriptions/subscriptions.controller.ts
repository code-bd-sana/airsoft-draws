import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Subscriptions')
@Controller('api/v1/subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = req.cookies?.accessToken;
    if (!token)
      throw new UnauthorizedException('No authentication token found');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Get the current host subscription' })
  async getMySubscription(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMySubscription(hostId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Get the current host billing history' })
  async getMyBillingHistory(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMyBillingHistory(hostId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Cancel the current active subscription' })
  async cancelSubscription(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.cancelSubscription(hostId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all subscriptions for admin' })
  async getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get subscription stats for admin dashboard' })
  async getAdminStats() {
    return this.subscriptionsService.getAdminStats();
  }
}
