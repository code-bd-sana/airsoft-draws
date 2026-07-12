import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and search' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('role') role: string = '',
  ) {
    return this.adminUsersService.getUsers(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      role,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User stats object' })
  async getStats() {
    return this.adminUsersService.getStats();
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Toggle user block status' })
  @ApiResponse({ status: 200, description: 'User block status updated' })
  async toggleBlockStatus(@Param('id') id: string) {
    return this.adminUsersService.toggleBlockStatus(id);
  }
}
