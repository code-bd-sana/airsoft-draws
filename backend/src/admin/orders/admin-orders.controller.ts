import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminOrdersService } from './admin-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin Orders')
@Controller('api/v1/admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ticket orders for admin dashboard' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getAllOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.adminOrdersService.getAllOrders(pageNumber, limitNumber, search);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics for admin dashboard' })
  async getOrdersStats() {
    return this.adminOrdersService.getOrdersStats();
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Process a refund for a ticket order' })
  async processRefund(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminOrdersService.processRefund(id, body.reason);
  }
}
