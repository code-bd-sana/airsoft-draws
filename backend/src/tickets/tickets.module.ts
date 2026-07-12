import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RafflesModule } from '../raffles/raffles.module';

@Module({
  imports: [PrismaModule, JwtModule, forwardRef(() => RafflesModule)],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
