import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AdminHostsService } from './admin-hosts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminHostsQueryDto } from './dto/admin-hosts-query.dto';

@ApiTags('Admin - Hosts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/hosts')
export class AdminHostsController {
  constructor(private readonly adminHostsService: AdminHostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all hosts with pagination and search (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of hosts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getHosts(@Query() query: AdminHostsQueryDto) {
    const pageNumber = query.page ? Number(query.page) : 1;
    const limitNumber = query.limit ? Number(query.limit) : 10;
    return this.adminHostsService.getHosts(
      pageNumber,
      limitNumber,
      query.search || '',
      query.status || 'All',
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get host statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Host stats object' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStats() {
    return this.adminHostsService.getStats();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a host profile (Admin only)' })
  @ApiParam({ name: 'id', description: 'The unique ID of the host profile' })
  @ApiResponse({ status: 200, description: 'Host successfully approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Host profile not found' })
  async approveHost(@Param('id') id: string) {
    return this.adminHostsService.approveHost(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a host profile application (Admin only)' })
  @ApiParam({ name: 'id', description: 'The unique ID of the host profile' })
  @ApiResponse({ status: 200, description: 'Host successfully rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Host profile not found' })
  async rejectHost(@Param('id') id: string) {
    return this.adminHostsService.rejectHost(id);
  }
}

