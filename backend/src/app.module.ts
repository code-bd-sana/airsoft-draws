import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RafflesModule } from './raffles/raffles.module';
import { HostsModule } from './hosts/hosts.module';
import { TicketsModule } from './tickets/tickets.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PaymentModule,
    SubscriptionsModule,
    RafflesModule,
    HostsModule,
    TicketsModule,
    AdminModule,
    ScheduleModule.forRoot(),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
