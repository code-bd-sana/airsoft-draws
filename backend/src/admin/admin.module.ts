import { Module } from '@nestjs/common';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';
import { AdminHostsController } from './hosts/admin-hosts.controller';
import { AdminHostsService } from './hosts/admin-hosts.service';

@Module({
  controllers: [AdminUsersController, AdminHostsController],
  providers: [AdminUsersService, AdminHostsService],
})
export class AdminModule {}
