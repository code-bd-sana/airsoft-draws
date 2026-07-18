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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create Stripe checkout session for a subscription plan',
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
  @ApiOperation({ summary: 'Cashflow Webhook Endpoint' })
  @ApiHeader({
    name: 'cashflow-signature',
    description: 'Secure signature for verifying payment gateway events',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook events processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid signature' })
  async handleWebhook(
    @Headers('cashflow-signature') signature: string,
    @Req() req: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing cashflow-signature header');
    }
    return this.paymentService.handleWebhook(signature, req.body);
  }
}
