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
  ApiCookieAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateSubscriptionRequestDto } from './dto/create-subscription-request.dto';
import { ApproveSubscriptionRequestDto } from './dto/approve-subscription-request.dto';
import { RejectSubscriptionRequestDto } from './dto/reject-subscription-request.dto';
import { AssignSubscriptionManuallyDto } from './dto/assign-subscription-manually.dto';

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
  @ApiOperation({
    summary: 'Get all active subscription plans (public)',
    description: 'Retrieves all available host subscription tiers (e.g. Free, Starter, Pro, Enterprise) with quotas and pricing.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get the current host subscription',
    description: 'Retrieves the active subscription plan, limits, and expiry dates for the logged-in host.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get the current host billing history',
    description: 'Retrieves historical subscription invoices, renewals, and payments for the host.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Cancel the current active subscription',
    description: 'Cancels the host subscription at the end of the billing period.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get all subscriptions for admin',
    description: 'Lists all host subscriptions across the platform with pagination and status filters.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get subscription stats for admin dashboard',
    description: 'Aggregates subscription revenue, active subscribers per plan tier, and churn metrics.',
  })
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Submit or update a manual subscription request',
    description: 'Allows a host to request a custom or bank-transferred plan duration for admin review.',
  })
  @ApiResponse({ status: 201, description: 'Subscription request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid plan ID or parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubscriptionRequest(
    @Req() req: Request,
    @Body() body: CreateSubscriptionRequestDto,
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get current host pending subscription request',
    description: 'Checks if the authenticated host has an open manual subscription request.',
  })
  @ApiResponse({ status: 200, description: 'Pending request details or null' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMySubscriptionRequest(@Req() req: Request) {
    const hostId = this.extractUserId(req);
    return this.subscriptionsService.getMySubscriptionRequest(hostId);
  }

  @Get('admin/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get all subscription requests for admin',
    description: 'Lists all pending, approved, and rejected manual subscription requests submitted by hosts.',
  })
  @ApiResponse({ status: 200, description: 'List of all subscription requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllSubscriptionRequestsAdmin() {
    return this.subscriptionsService.getAllSubscriptionRequestsAdmin();
  }

  @Post('admin/requests/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Approve a subscription request with custom duration',
    description: 'Approves a host subscription request, creating or extending active subscription records.',
  })
  @ApiResponse({ status: 200, description: 'Subscription request approved' })
  @ApiResponse({ status: 404, description: 'Subscription request not found' })
  async approveSubscriptionRequest(
    @Body() body: ApproveSubscriptionRequestDto,
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Reject a subscription request',
    description: 'Rejects a host subscription request with optional explanatory notes.',
  })
  @ApiResponse({ status: 200, description: 'Subscription request rejected' })
  @ApiResponse({ status: 404, description: 'Subscription request not found' })
  async rejectSubscriptionRequest(
    @Body() body: RejectSubscriptionRequestDto,
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
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Directly assign a subscription plan to a host',
    description: 'Grants an active subscription plan directly to a host profile without a prior request.',
  })
  @ApiResponse({ status: 200, description: 'Plan successfully assigned' })
  @ApiResponse({ status: 404, description: 'Host profile or plan not found' })
  async assignSubscriptionManually(
    @Body() body: AssignSubscriptionManuallyDto,
  ) {
    return this.subscriptionsService.assignSubscriptionManually(
      body.hostProfileId,
      body.planId,
      body.durationDays || 30,
      body.adminNotes,
    );
  }
}
