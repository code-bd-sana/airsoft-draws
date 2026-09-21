import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PurchaseTicketsDto } from './dto/purchase-tickets.dto';
import { BasketCheckoutDto } from './dto/checkout.dto';
import { extractTokenFromRequest } from '../common/utils/extract-token';

@ApiTags('Tickets')
@Controller('api/v1/tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = extractTokenFromRequest(req);
    if (!token)
      throw new UnauthorizedException('No authentication token found');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('purchase/:raffleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'USER', 'HOST', 'ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Purchase tickets for a competition',
    description: 'Purchases and randomly allocates ticket numbers, verifies 18+ age and UKARA eligibility, and checks instant wins.',
  })
  @ApiParam({
    name: 'raffleId',
    description: 'The unique ID of the raffle/competition',
  })
  @ApiResponse({ status: 201, description: 'Tickets successfully purchased and allocated' })
  @ApiResponse({
    status: 400,
    description: 'Insufficient tickets, user under 18, missing UKARA, or terms not accepted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Raffle or user account not found' })
  async purchaseTickets(
    @Req() req: Request,
    @Param('raffleId') raffleId: string,
    @Body() body: PurchaseTicketsDto,
  ) {
    if (!body.quantity || body.quantity < 1) {
      throw new BadRequestException(
        'Quantity is required and must be at least 1',
      );
    }
    const userId = this.extractUserId(req);
    return this.ticketsService.purchaseTickets(userId, raffleId, body);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'USER', 'HOST', 'ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Multi-raffle basket checkout',
    description:
      'Purchases and allocates tickets across multiple competitions, auto-saves delivery details to profile, and evaluates instant wins.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Tickets successfully purchased and allocated across basket items',
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failure, insufficient tickets, underage user, or missing UKARA',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkout(
    @Req() req: Request,
    @Body() body: BasketCheckoutDto,
  ) {
    const userId = this.extractUserId(req);
    return this.ticketsService.checkout(userId, body);
  }

  @Get('my-tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get all tickets purchased by the current user',
    description: 'Retrieves all historical and active competition tickets held by the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'List of purchased tickets' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyTickets(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.ticketsService.getUserTickets(userId);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get all ticket orders and transactions for the authenticated user',
    description: 'Retrieves all completed and pending incomplete orders with live competition availability and retry payment option.',
  })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrders(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.ticketsService.getUserOrders(userId);
  }

  @Post('orders/:orderId/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Retry or resume payment for an incomplete order',
    description: 'Verifies the competition is still active and has remaining tickets, then initiates a new Cashflows payment session.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'The transaction ID of the incomplete order',
  })
  @ApiResponse({ status: 200, description: 'Payment session initialized, returns redirect URL' })
  @ApiResponse({ status: 400, description: 'Competition is closed or sold out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async retryOrderPayment(
    @Req() req: Request,
    @Param('orderId') orderId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.ticketsService.retryOrderPayment(userId, orderId);
  }
}

