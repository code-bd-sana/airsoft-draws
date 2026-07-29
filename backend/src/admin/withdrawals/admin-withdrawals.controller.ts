import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminWithdrawalsService } from './admin-withdrawals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin / Withdrawals')
@Controller('api/v1/admin/withdrawals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminWithdrawalsController {
  constructor(private readonly adminWithdrawalsService: AdminWithdrawalsService) {}

  @Get()
  @ApiOperation({ summary: 'List all host withdrawal requests (Admin)' })
  @ApiResponse({ status: 200, description: 'List of withdrawal requests' })
  findAll() {
    return this.adminWithdrawalsService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve, complete, or reject a host withdrawal request' })
  @ApiResponse({ status: 200, description: 'Withdrawal status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'COMPLETED' | 'REJECTED'; adminNotes?: string },
  ) {
    return this.adminWithdrawalsService.updateStatus(id, body.status, body.adminNotes);
  }
}
