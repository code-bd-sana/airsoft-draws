import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminHostsService } from './admin-hosts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Hosts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/hosts')
export class AdminHostsController {
  constructor(private readonly adminHostsService: AdminHostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hosts with pagination and search' })
  @ApiResponse({ status: 200, description: 'List of hosts' })
  async getHosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('status') status: string = 'All',
  ) {
    return this.adminHostsService.getHosts(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      status,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get host statistics' })
  @ApiResponse({ status: 200, description: 'Host stats object' })
  async getStats() {
    return this.adminHostsService.getStats();
  }
}
