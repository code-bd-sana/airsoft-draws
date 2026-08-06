import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { HostsService } from './hosts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@ApiTags('Hosts')
@Controller('api/v1/hosts')
export class HostsController {
  constructor(
    private readonly hostsService: HostsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = req.cookies?.accessToken;
    if (!token)
      throw new UnauthorizedException('No authentication token found');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified hosts (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of all verified host profiles',
  })
  findAllVerifiedPublic() {
    return this.hostsService.findAllVerifiedPublic();
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current host overview dashboard metrics and analytics' })
  @ApiResponse({ status: 200, description: 'Host dashboard metrics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDashboardOverview(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.hostsService.getHostDashboardOverview(userId);
  }

  @Get('wallet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current host wallet balance and metrics' })
  @ApiResponse({ status: 200, description: 'Host wallet metrics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWalletStats(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.hostsService.getWalletStats(userId);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new withdrawal request' })
  @ApiResponse({ status: 201, description: 'Withdrawal request created' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  requestWithdrawal(@Req() req: Request, @Body() dto: RequestWithdrawalDto) {
    const userId = this.extractUserId(req);
    return this.hostsService.requestWithdrawal(userId, dto);
  }

  @Get('withdrawals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get history of withdrawal requests for current host' })
  @ApiResponse({ status: 200, description: 'List of withdrawal requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWithdrawalsHistory(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.hostsService.getWithdrawalsHistory(userId);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a single host profile by slug (public)' })
  @ApiParam({
    name: 'slug',
    description: 'The unique URL slug of the host profile',
  })
  @ApiResponse({ status: 200, description: 'Host profile details' })
  @ApiResponse({ status: 404, description: 'Host not found' })
  findOnePublic(@Param('slug') slug: string) {
    return this.hostsService.findOnePublic(slug);
  }
}
