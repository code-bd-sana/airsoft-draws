import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { extractTokenFromRequest } from '../../common/utils/extract-token';
import { AdminTicketAssignmentService } from './admin-ticket-assignment.service';
import { AdminAssignTicketsDto } from './dto/admin-assign-tickets.dto';

@ApiTags('Admin - Ticket Assignment')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@Controller('api/v1/admin/ticket-assignment')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminTicketAssignmentController {
  constructor(
    private readonly assignmentService: AdminTicketAssignmentService,
  ) {}

  private extractAdminId(req: Request): string {
    const user = (req as any).user;
    if (user && (user.sub || user.id)) {
      return user.sub || user.id;
    }
    throw new UnauthorizedException('Admin user not identified');
  }

  @Get('competitions')
  @ApiOperation({ summary: 'Get active competitions for ticket assignment' })
  @ApiQuery({ name: 'search', required: false, description: 'Search title or prize' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (default ACTIVE)' })
  @ApiQuery({ name: 'hostId', required: false, description: 'Filter by host ID' })
  async getCompetitions(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('hostId') hostId?: string,
  ) {
    return this.assignmentService.getCompetitions({ search, status, hostId });
  }

  @Get('competitions/:id')
  @ApiOperation({ summary: 'Get ticket breakdown, instant wins, and sold tickets for a competition' })
  @ApiParam({ name: 'id', description: 'Competition ID' })
  async getCompetitionTicketDetails(@Param('id') id: string) {
    return this.assignmentService.getCompetitionTicketDetails(id);
  }

  @Get('users/search')
  @ApiOperation({ summary: 'Search users by name, email, or ID for ticket assignment' })
  @ApiQuery({ name: 'q', required: false, description: 'Search term' })
  async searchUsers(@Query('q') q?: string) {
    return this.assignmentService.searchUsers(q || '');
  }

  @Post('assign')
  @ApiOperation({
    summary: 'Manually assign tickets to a user without gateway payment',
    description: 'Creates transaction, credits host wallet, updates ticketsSold, checks instant wins, and logs audit record.',
  })
  @ApiResponse({ status: 201, description: 'Tickets assigned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ticket numbers, sold out, or user blocked' })
  @ApiResponse({ status: 404, description: 'User or Competition not found' })
  async assignTickets(
    @Req() req: Request,
    @Body() dto: AdminAssignTicketsDto,
  ) {
    const adminId = this.extractAdminId(req);
    return this.assignmentService.assignTickets(adminId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get history of all admin manual ticket assignments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAssignmentHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.assignmentService.getAssignmentHistory(pageNum, limitNum);
  }
}
