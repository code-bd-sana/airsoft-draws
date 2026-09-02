import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CheckoutSubscriptionDto } from './dto/checkout-subscription.dto';

@ApiTags('Payment')
@Controller('api/v1/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
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

  @Post('checkout/subscription')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create payment checkout session for a subscription plan',
    description: 'Initiates a payment gateway checkout session (e.g. Cashflows / Stripe) and returns the redirect URL.',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created successfully, returns checkout URL',
  })
  @ApiResponse({ status: 400, description: 'Invalid planId' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubscriptionCheckout(
    @Req() req: Request,
    @Body() body: CheckoutSubscriptionDto,
  ) {
    if (!body.planId) throw new BadRequestException('planId is required');
    const hostId = this.extractUserId(req);
    return this.paymentService.createSubscriptionCheckout(hostId, body.planId);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Payment Gateway Webhook Endpoint',
    description: 'Processes asynchronous payment notifications and signature verification from Cashflows or Stripe.',
  })
  @ApiHeader({
    name: 'hash',
    description: 'Webhook verification HMAC hash from payment gateway',
    required: false,
  })
  @ApiHeader({
    name: 'signature',
    description: 'Webhook signature header',
    required: false,
  })
  @ApiHeader({
    name: 'cashflow-signature',
    description: 'Cashflows specific verification header',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook event processed successfully',
  })
  async handleWebhook(
    @Req() req: any,
    @Headers() headers: Record<string, string>,
  ) {
    const signature =
      headers['hash'] ||
      headers['signature'] ||
      headers['cashflow-signature'] ||
      '';
    return this.paymentService.handleWebhook(signature, req.body);
  }
}

