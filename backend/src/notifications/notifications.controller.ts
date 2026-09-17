import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QueryNotificationsDto } from './dto/query-notifications.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private extractUserId(req: Request): string {
    const user = (req as any).user;
    const userId = user?.sub || user?.id;
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }
    return userId;
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated notifications for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications successfully retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNotifications(
    @Req() req: Request,
    @Query() query: QueryNotificationsDto,
  ) {
    const userId = this.extractUserId(req);
    return this.notificationsService.findAllForUser(userId, query);
  }

  @Get('unread-count')
  @ApiOperation({
    summary: 'Get unread notification count for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count successfully retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUnreadCount(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Mark all unread notifications as read for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark an individual notification as read',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAsRead(userId, id);
  }
}
