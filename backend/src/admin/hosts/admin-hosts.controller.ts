import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminHostsService } from './admin-hosts.service';
import { AdminHostsQueryDto } from './dto/admin-hosts-query.dto';

@ApiTags('Admin - Hosts')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/hosts')
export class AdminHostsController {
  constructor(private readonly adminHostsService: AdminHostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all hosts with pagination and search (Admin only)',
    description: 'Lists all registered host profiles with associated plan details, wallet balances, active competitions count, and verification status.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of host profiles' })
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
  @ApiOperation({
    summary: 'Get host statistics (Admin only)',
    description: 'Retrieves totals for verified, pending, and suspended host profiles.',
  })
  @ApiResponse({ status: 200, description: 'Host stats aggregated metrics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStats() {
    return this.adminHostsService.getStats();
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Approve a host profile (Admin only)',
    description: 'Grants verification approval to a host profile application.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the host profile' })
  @ApiResponse({ status: 200, description: 'Host successfully approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Host profile not found' })
  async approveHost(@Param('id') id: string) {
    return this.adminHostsService.approveHost(id);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Reject a host profile application (Admin only)',
    description: 'Rejects host application, removes pending subscription records, and restores user to standard client role.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the host profile' })
  @ApiResponse({ status: 200, description: 'Host successfully rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Host profile not found' })
  async rejectHost(@Param('id') id: string) {
    return this.adminHostsService.rejectHost(id);
  }
}

