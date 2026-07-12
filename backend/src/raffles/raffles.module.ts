import { Module } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { RafflesController } from './raffles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { DrawSchedulerService } from './draw-scheduler.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [RafflesController],
  providers: [RafflesService, DrawSchedulerService],
  exports: [RafflesService],
})
export class RafflesModule {}
