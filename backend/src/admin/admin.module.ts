import { Module } from '@nestjs/common';
import { AdminHostsController } from './hosts/admin-hosts.controller';
import { AdminHostsService } from './hosts/admin-hosts.service';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';
import { AdminWinnersController } from './winners/admin-winners.controller';
import { AdminWinnersService } from './winners/admin-winners.service';
import { AdminDashboardController } from './dashboard/admin-dashboard.controller';
import { AdminDashboardService } from './dashboard/admin-dashboard.service';

@Module({
  controllers: [
    AdminUsersController,
    AdminHostsController,
    AdminOrdersController,
    AdminWinnersController,
    AdminDashboardController,
  ],
  providers: [
    AdminUsersService,
    AdminHostsService,
    AdminOrdersService,
    AdminWinnersService,
    AdminDashboardService,
  ],
})
export class AdminModule {}
