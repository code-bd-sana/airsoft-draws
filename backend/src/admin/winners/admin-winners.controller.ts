import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminWinnersService } from './admin-winners.service';
import { AdminWinnersQueryDto } from './dto/admin-winners-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Admin - Winners')
@ApiBearerAuth()
@Controller('api/v1/admin/winners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminWinnersController {
  constructor(private readonly adminWinnersService: AdminWinnersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all winners with pagination and compliance filters (Admin only)',
  })
  getAllWinners(@Query() query: AdminWinnersQueryDto) {
    return this.adminWinnersService.getAllWinners(
      query.page ? Number(query.page) : 1,
      query.limit ? Number(query.limit) : 20,
      query.status,
      query.verificationStatus,
      query.winType,
    );
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Quick verify a winner (Admin only)' })
  verifyWinner(@Req() req: any, @Param('id') id: string) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.verifyWinner(id, reviewerId);
  }

  @Post(':id/upload-id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/private_documents',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `ID_${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
          return cb(
            new BadRequestException('Only JPG, PNG, WEBP, or PDF files are allowed for identity verification!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    }),
  )
  @ApiOperation({ summary: 'Upload private government ID document for a winner (Admin only)' })
  @ApiConsumes('multipart/form-data')
  uploadIdDocument(
    @Req() req: any,
    @Param('id') winnerId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('ID document file is required');
    }
    const reviewerId = req.user?.id || req.user?.sub;
    const documentType = file.mimetype.includes('pdf') ? 'PDF' : 'IMAGE';
    return this.adminWinnersService.saveIdDocument(
      winnerId,
      file.path,
      documentType,
      reviewerId,
    );
  }

  @Get(':id/id-document')
  @ApiOperation({ summary: 'Securely retrieve private winner ID document (Admin only)' })
  async getIdDocument(@Param('id') winnerId: string, @Res() res: Response) {
    const filePath = await this.adminWinnersService.getIdDocumentPath(winnerId);
    return res.sendFile(filePath);
  }

  @Patch(':id/compliance-verification')
  @ApiOperation({ summary: 'Update detailed compliance verification status (Admin only)' })
  updateVerification(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      verificationStatus: string;
      ukaraStatus?: string;
      dobMatch?: boolean;
      nameMatch?: boolean;
    },
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateVerification(id, body, reviewerId);
  }

  @Patch(':id/alternative-prize')
  @ApiOperation({ summary: 'Offer cash alternative or two-tone substitution (Admin only)' })
  updateAlternative(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      alternativeType: string;
      alternativeAmount?: number;
      alternativeReason?: string;
      alternativeStatus?: string;
    },
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateAlternative(id, body, reviewerId);
  }

  @Patch(':id/prize-transfer')
  @ApiOperation({ summary: 'Manage prize transfer to verified recipient (Admin only)' })
  updateTransfer(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      transferRecipientName: string;
      transferRecipientDob?: string;
      transferRecipientUkara?: string;
      transferStatus: string;
      transferAdminNotes?: string;
    },
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateTransfer(id, body, reviewerId);
  }

  @Patch(':id/fulfillment-packaging')
  @ApiOperation({ summary: 'Update discreet packaging, courier tracking or office collection (Admin only)' })
  updateFulfillment(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      fulfillmentMethod?: string;
      packagingType?: string;
      discreetPackagingConfirmed?: boolean;
      courierName?: string;
      trackingNumber?: string;
      collectionStaffMember?: string;
      deliveryStatus?: string;
    },
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateFulfillment(id, body, reviewerId);
  }
}
