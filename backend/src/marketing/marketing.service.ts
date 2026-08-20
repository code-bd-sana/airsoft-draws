import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketingReportDto } from './dto/create-marketing-report.dto';

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(dto: CreateMarketingReportDto) {
    const report = await this.prisma.marketingReport.create({
      data: {
        raffleId: dto.raffleId || null,
        reason: dto.reason,
        description: dto.description,
        reporterEmail: dto.reporterEmail || null,
        status: 'SUBMITTED',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'MARKETING_REPORT_SUBMITTED',
        entityType: 'MARKETING_REPORT',
        entityId: report.id,
        details: `Marketing report created for reason: ${dto.reason}`,
      },
    });

    return report;
  }

  async getAllReports() {
    return this.prisma.marketingReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReportStatus(
    id: string,
    status: string,
    reviewerId?: string,
    notes?: string,
  ) {
    const report = await this.prisma.marketingReport.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException('Marketing report not found');
    }

    const updated = await this.prisma.marketingReport.update({
      where: { id },
      data: {
        status,
        assignedReviewerId: reviewerId || report.assignedReviewerId,
        resolutionNotes: notes !== undefined ? notes : report.resolutionNotes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: reviewerId || null,
        action: 'MARKETING_REPORT_UPDATED',
        entityType: 'MARKETING_REPORT',
        entityId: report.id,
        details: `Status updated to ${status}. Notes: ${notes || 'None'}`,
      },
    });

    return updated;
  }
}
