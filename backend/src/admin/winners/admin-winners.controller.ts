import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminWinnersService } from './admin-winners.service';
import { AdminWinnersQueryDto } from './dto/admin-winners-query.dto';

@ApiTags('Admin - Winners')
@ApiBearerAuth()
@Controller('admin/winners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminWinnersController {
  constructor(private readonly adminWinnersService: AdminWinnersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all winners with pagination and filters (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of winners',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllWinners(@Query() query: AdminWinnersQueryDto) {
    return this.adminWinnersService.getAllWinners(
      query.page ? Number(query.page) : 1,
      query.limit ? Number(query.limit) : 20,
      query.status,
      query.verificationStatus,
      query.winType,
    );
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify a winner (Admin only)' })
  @ApiParam({ name: 'id', description: 'The ID of the winner to verify' })
  @ApiResponse({ status: 200, description: 'Winner successfully verified' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner not found' })
  verifyWinner(@Param('id') id: string) {
    return this.adminWinnersService.verifyWinner(id);
  }
}
