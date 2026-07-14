import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminWinnersService } from './admin-winners.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('admin/winners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminWinnersController {
  constructor(private readonly adminWinnersService: AdminWinnersService) {}

  @Get()
  async getAllWinners(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('verificationStatus') verificationStatus?: string,
  ) {
    return this.adminWinnersService.getAllWinners(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      verificationStatus,
    );
  }

  @Patch(':id/verify')
  async verifyWinner(@Param('id') id: string) {
    return this.adminWinnersService.verifyWinner(id);
  }
}
