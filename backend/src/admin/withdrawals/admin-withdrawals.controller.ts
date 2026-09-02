import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminWithdrawalsService } from './admin-withdrawals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateWithdrawalStatusDto } from './dto/update-withdrawal-status.dto';

@ApiTags('Admin - Withdrawals')
@Controller('api/v1/admin/withdrawals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
export class AdminWithdrawalsController {
  constructor(private readonly adminWithdrawalsService: AdminWithdrawalsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all host withdrawal requests (Admin only)',
    description: 'Retrieves all pending and processed host payout requests with host profiles and banking details.',
  })
  @ApiResponse({ status: 200, description: 'List of all withdrawal requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.adminWithdrawalsService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Approve, complete, or reject a host withdrawal request (Admin only)',
    description: 'Updates withdrawal status, recalculates wallet ledger entries on rejection, or marks payout as fulfilled.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the withdrawal request' })
  @ApiResponse({ status: 200, description: 'Withdrawal status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateWithdrawalStatusDto,
  ) {
    return this.adminWithdrawalsService.updateStatus(id, body.status, body.adminNotes);
  }
}
