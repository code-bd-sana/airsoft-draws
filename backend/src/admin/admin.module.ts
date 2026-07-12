import { Module } from '@nestjs/common';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';
import { AdminHostsController } from './hosts/admin-hosts.controller';
import { AdminHostsService } from './hosts/admin-hosts.service';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';

@Module({
  controllers: [AdminUsersController, AdminHostsController, AdminOrdersController],
  providers: [AdminUsersService, AdminHostsService, AdminOrdersService],
})
export class AdminModule {}
