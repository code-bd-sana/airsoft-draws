import { Controller, Post, Get, Param, Body, UseGuards, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Tickets')
@Controller('api/v1/tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = req.cookies?.accessToken;
    if (!token) throw new UnauthorizedException('No authentication token found');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('purchase/:raffleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'USER', 'HOST', 'ADMIN') // Allow any logged-in user to buy
  @ApiOperation({ summary: 'Purchase tickets for a competition' })
  async purchaseTickets(
    @Req() req: Request,
    @Param('raffleId') raffleId: string,
    @Body() body: { quantity: number }
  ) {
    if (!body.quantity || body.quantity < 1) {
      throw new BadRequestException('Quantity is required and must be at least 1');
    }
    const userId = this.extractUserId(req);
    return this.ticketsService.purchaseTickets(userId, raffleId, body.quantity);
  }

  @Get('my-tickets')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tickets purchased by the current user' })
  async getMyTickets(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.ticketsService.getUserTickets(userId);
  }
}
