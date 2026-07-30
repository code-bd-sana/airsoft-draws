import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RafflesService } from './raffles.service';

@Injectable()
export class DrawSchedulerService {
  private readonly logger = new Logger(DrawSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rafflesService: RafflesService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoDraws() {
    const now = new Date();

    // 1. Process Auto-Draw Competitions
    const autoDrawRaffles = await this.prisma.raffle.findMany({
      where: {
        status: 'ACTIVE',
        isAutoDraw: true,
        OR: [
          { endDate: { lte: now } },
          { ticketsSold: { gte: this.prisma.raffle.fields.totalTickets } },
        ],
      },
    });

    for (const raffle of autoDrawRaffles) {
      try {
        this.logger.log(
          `Auto-drawing winner for competition ID: ${raffle.id} - ${raffle.title}`,
        );
        await this.rafflesService.drawWinner(raffle.id);
        this.logger.log(
          `Successfully auto-drawn winner for competition ID: ${raffle.id}`,
        );
      } catch (error: any) {
        this.logger.error(
          `Failed to auto-draw winner for competition ID: ${raffle.id}`,
          error.stack,
        );
      }
    }

    // 2. Process Manual Draw Competitions (close when expired/sold out, wait for host/admin manual input)
    const manualDrawRaffles = await this.prisma.raffle.findMany({
      where: {
        status: 'ACTIVE',
        isAutoDraw: false,
        OR: [
          { endDate: { lte: now } },
          { ticketsSold: { gte: this.prisma.raffle.fields.totalTickets } },
        ],
      },
    });

    for (const raffle of manualDrawRaffles) {
      try {
        this.logger.log(
          `Closing manual-draw competition ID: ${raffle.id} - waiting for host/admin manual winner selection`,
        );
        await this.prisma.raffle.update({
          where: { id: raffle.id },
          data: { status: 'ENDED' },
        });
      } catch (error: any) {
        this.logger.error(
          `Failed to close manual-draw competition ID: ${raffle.id}`,
          error.stack,
        );
      }
    }
  }
}
