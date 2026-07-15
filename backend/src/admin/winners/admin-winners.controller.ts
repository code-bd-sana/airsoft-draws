import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminWinnersService } from './admin-winners.service';

@Controller('admin/winners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminWinnersController {
  constructor(private readonly adminWinnersService: AdminWinnersService) {}

  @Get()
  getAllWinners(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('verificationStatus') verificationStatus?: string,
    @Query('winType') winType?: string,
  ) {
    return this.adminWinnersService.getAllWinners(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
      verificationStatus,
      winType,
    );
  }

  @Patch(':id/verify')
  verifyWinner(@Param('id') id: string) {
    return this.adminWinnersService.verifyWinner(id);
  }
}
