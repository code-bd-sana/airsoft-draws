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

@ApiTags('Tickets')
@Controller('api/v1/tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
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
}

