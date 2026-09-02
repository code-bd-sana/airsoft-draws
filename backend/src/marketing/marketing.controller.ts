import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateMarketingReportDto } from './dto/create-marketing-report.dto';
import { UpdateMarketingReportDto } from './dto/update-marketing-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Marketing Compliance')
@Controller('api/v1')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('marketing-reports')
  @ApiOperation({
    summary: 'Submit a marketing concern or advertising policy report (public)',
    description: 'Allows community members or visitors to flag deceptive advertising, misleading prizes, or policy concerns.',
  })
  @ApiResponse({ status: 201, description: 'Marketing concern report successfully recorded' })
  @ApiResponse({ status: 400, description: 'Validation error in submission fields' })
  async createReport(@Body() dto: CreateMarketingReportDto) {
    return this.marketingService.createReport(dto);
  }

  @Get('admin/marketing-reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'List all submitted marketing concern reports (Admin only)',
    description: 'Retrieves all user-submitted advertising compliance reports ordered chronologically.',
  })
  @ApiResponse({ status: 200, description: 'List of all marketing reports' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAllReports() {
    return this.marketingService.getAllReports();
  }

  @Patch('admin/marketing-reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Update marketing report status and resolution notes (Admin only)',
    description: 'Updates review status and appends resolution notes to a flagged marketing report.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the marketing report' })
  @ApiResponse({ status: 200, description: 'Report status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Marketing report not found' })
  async updateReport(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateMarketingReportDto,
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.marketingService.updateReportStatus(
      id,
      body.status,
      reviewerId,
      body.notes,
    );
  }
}
