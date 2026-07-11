import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RafflesService } from './raffles.service';

@Injectable()
export class DrawSchedulerService {
  private readonly logger = new Logger(DrawSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rafflesService: RafflesService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoDraws() {
    this.logger.log('Checking for competitions that need to be auto-drawn...');
    const now = new Date();

    const expiredRaffles = await this.prisma.raffle.findMany({
      where: {
        status: 'ACTIVE',
        isAutoDraw: true,
        autoDrawDate: true,
        endDate: {
          lte: now
        }
      }
    });

    if (expiredRaffles.length === 0) {
      return;
    }

    this.logger.log(`Found ${expiredRaffles.length} competition(s) to auto-draw.`);

    for (const raffle of expiredRaffles) {
      try {
        this.logger.log(`Drawing winner for competition ID: ${raffle.id} - ${raffle.title}`);
        await this.rafflesService.drawWinner(raffle.id);
        this.logger.log(`Successfully drawn winner for competition ID: ${raffle.id}`);
      } catch (error: any) {
        this.logger.error(`Failed to draw winner for competition ID: ${raffle.id}`, error.stack);
      }
    }
  }
}
