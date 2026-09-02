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
  ApiCookieAuth,
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
import { ComplianceVerificationDto } from './dto/compliance-verification.dto';
import { AlternativePrizeDto } from './dto/alternative-prize.dto';
import { PrizeTransferDto } from './dto/prize-transfer.dto';
import { FulfillmentPackagingDto } from './dto/fulfillment-packaging.dto';
import { FileUploadDto } from '../../common/dto/file-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

@ApiTags('Admin - Winners')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@Controller('api/v1/admin/winners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminWinnersController {
  constructor(private readonly adminWinnersService: AdminWinnersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all winners with pagination and compliance filters (Admin only)',
    description: 'Lists all instant win and main draw winners with verification and delivery status.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of winner records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({
    summary: 'Quick verify a winner (Admin only)',
    description: 'Marks winner KYC verification as approved and records reviewer audit log.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Winner successfully verified' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner record not found' })
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
  @ApiOperation({
    summary: 'Upload private government ID document for a winner (Admin only)',
    description: 'Securely stores government-issued photo ID / passport for compliance checks.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 201, description: 'ID document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or missing file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({
    summary: 'Securely retrieve private winner ID document (Admin only)',
    description: 'Streams stored encrypted/private identity verification file for admin inspection.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Identity file binary stream' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getIdDocument(@Param('id') winnerId: string, @Res() res: Response) {
    const filePath = await this.adminWinnersService.getIdDocumentPath(winnerId);
    return res.sendFile(filePath);
  }

  @Patch(':id/compliance-verification')
  @ApiOperation({
    summary: 'Update detailed compliance verification status (Admin only)',
    description: 'Updates UKARA status, DOB match verification, and name match confirmation.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Compliance verification updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid compliance data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner record not found' })
  updateVerification(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: ComplianceVerificationDto,
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateVerification(id, body, reviewerId);
  }

  @Patch(':id/alternative-prize')
  @ApiOperation({
    summary: 'Offer cash alternative or two-tone substitution (Admin only)',
    description: 'Records cash alternative conversion or two-tone spray replacement details.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Alternative prize updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid alternative prize details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner record not found' })
  updateAlternative(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: AlternativePrizeDto,
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateAlternative(id, body, reviewerId);
  }

  @Patch(':id/prize-transfer')
  @ApiOperation({
    summary: 'Manage prize transfer to verified recipient (Admin only)',
    description: 'Assigns prize fulfillment to a nominated 18+ UKARA-verified recipient.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Prize transfer record updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid recipient details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner record not found' })
  updateTransfer(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: PrizeTransferDto,
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateTransfer(id, body, reviewerId);
  }

  @Patch(':id/fulfillment-packaging')
  @ApiOperation({
    summary: 'Update discreet packaging, courier tracking or office collection (Admin only)',
    description: 'Sets dispatch logistics, discreet outer packaging confirmation, tracking codes, or store handover.',
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the winning ticket record' })
  @ApiResponse({ status: 200, description: 'Fulfillment packaging details updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid fulfillment details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Winner record not found' })
  updateFulfillment(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: FulfillmentPackagingDto,
  ) {
    const reviewerId = req.user?.id || req.user?.sub;
    return this.adminWinnersService.updateFulfillment(id, body, reviewerId);
  }
}
