import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'List of subscription plans successfully retrieved',
  })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current host subscription' })
  @ApiResponse({
    status: 200,
    description: 'Current active subscription details',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - host role required' })
  async getMySubscription(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMySubscription(hostId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current host billing history' })
  @ApiResponse({
    status: 200,
    description: 'Host billing history transactions',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - host role required' })
  async getMyBillingHistory(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMyBillingHistory(hostId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel the current active subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - host role required' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async cancelSubscription(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.cancelSubscription(hostId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscriptions for admin' })
  @ApiResponse({ status: 200, description: 'List of all subscriptions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only access' })
  async getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription stats for admin dashboard' })
  @ApiResponse({ status: 200, description: 'Subscription stats object' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only access' })
  async getAdminStats() {
    return this.subscriptionsService.getAdminStats();
  }

  // --- Manual Subscription Requests Endpoints ---

  @Post('request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit or update a manual subscription request' })
  async createSubscriptionRequest(
    @Req() req: Request,
    @Body() body: { planId: string; requestedDays?: number; note?: string },
  ) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.createSubscriptionRequest(
      hostId,
      body.planId,
      body.requestedDays,
      body.note,
    );
  }

  @Get('request/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current host pending subscription request' })
  async getMySubscriptionRequest(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMySubscriptionRequest(hostId);
  }

  @Get('admin/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscription requests for admin' })
  async getAllSubscriptionRequestsAdmin() {
    return this.subscriptionsService.getAllSubscriptionRequestsAdmin();
  }

  @Post('admin/requests/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a subscription request with custom duration' })
  async approveSubscriptionRequest(
    @Body() body: { requestId: string; approvedDays?: number; adminNotes?: string },
  ) {
    return this.subscriptionsService.approveSubscriptionRequest(
      body.requestId,
      body.approvedDays,
      body.adminNotes,
    );
  }

  @Post('admin/requests/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a subscription request' })
  async rejectSubscriptionRequest(
    @Body() body: { requestId: string; adminNotes?: string },
  ) {
    return this.subscriptionsService.rejectSubscriptionRequest(
      body.requestId,
      body.adminNotes,
    );
  }

  @Post('admin/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Directly assign a subscription plan to a host' })
  async assignSubscriptionManually(
    @Body() body: { hostProfileId: string; planId: string; durationDays?: number; adminNotes?: string },
  ) {
    return this.subscriptionsService.assignSubscriptionManually(
      body.hostProfileId,
      body.planId,
      body.durationDays || 30,
      body.adminNotes,
    );
  }
}
