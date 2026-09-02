import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get general administrative overview metrics (Admin only)',
    description: 'Aggregates platform users count, active hosts count, live competitions, gross revenue, pending reviews, and recent activity timeline.',
  })
  @ApiResponse({ status: 200, description: 'Overview statistics and live activity logs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getOverviewStats() {
    return this.adminDashboardService.getOverviewStats();
  }

  @Get('logs')
  @ApiOperation({
    summary: 'Get administrative system logs (Admin only)',
    description: 'Retrieves searchable and categorized administrative activity, system audit, and transaction audit logs.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'admin' })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    enum: ['All', 'User Actions', 'Admin Actions', 'System Events', 'Errors'],
    example: 'All',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of system audit logs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getSystemLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('filter') filter?: string,
  ) {
    return this.adminDashboardService.getSystemLogs({ page, limit, search, filter });
  }
}

