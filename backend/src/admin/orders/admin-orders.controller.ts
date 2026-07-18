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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminOrdersQueryDto } from './dto/admin-orders-query.dto';
import { RefundOrderDto } from './dto/refund-order.dto';

@ApiTags('Admin - Orders')
@ApiBearerAuth()
@Controller('api/v1/admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all ticket orders for admin dashboard (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of ticket orders successfully retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllOrders(@Query() query: AdminOrdersQueryDto) {
    const pageNumber = query.page ? Number(query.page) : 1;
    const limitNumber = query.limit ? Number(query.limit) : 10;
    return this.adminOrdersService.getAllOrders(
      pageNumber,
      limitNumber,
      query.search,
    );
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get order statistics for admin dashboard (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Order stats object successfully retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getOrdersStats() {
    return this.adminOrdersService.getOrdersStats();
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Process a refund for a ticket order (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the order transaction to refund',
  })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or order already refunded',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async processRefund(@Param('id') id: string, @Body() body: RefundOrderDto) {
    return this.adminOrdersService.processRefund(id, body.reason);
  }
}
