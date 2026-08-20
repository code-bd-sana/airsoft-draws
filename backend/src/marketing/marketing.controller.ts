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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Marketing Compliance')
@Controller('api/v1')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('marketing-reports')
  @ApiOperation({ summary: 'Submit a marketing concern or advertising policy report' })
  async createReport(@Body() dto: CreateMarketingReportDto) {
    return this.marketingService.createReport(dto);
  }

  @Get('admin/marketing-reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all submitted marketing concern reports' })
  async getAllReports() {
    return this.marketingService.getAllReports();
  }

  @Patch('admin/marketing-reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update marketing report status and resolution notes' })
  async updateReport(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
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
