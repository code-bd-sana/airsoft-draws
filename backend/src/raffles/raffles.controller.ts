import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import {
  FindAllPublicRafflesQueryDto,
  FindHostRafflesQueryDto,
  GetPublicWinnersQueryDto,
  FindAllAdminRafflesQueryDto,
} from './dto/query-raffles.dto';
import { FileUploadDto } from '../common/dto/file-upload.dto';

@ApiTags('Raffles')
@Controller('api/v1/raffles')
export class RafflesController {
  constructor(
    private readonly rafflesService: RafflesService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = req.cookies?.accessToken;
    if (!token)
      throw new UnauthorizedException('No authentication token found');
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // --- PUBLIC ENDPOINTS ---

  @Get('public/stats')
  @ApiOperation({ summary: 'Get global raffle statistics (public)' })
  @ApiResponse({
    status: 200,
    description: 'Global raffle stats retrieved successfully',
  })
  getPublicStats() {
    return this.rafflesService.getPublicStats();
  }

  @Get('public/winner-stats')
  @ApiOperation({ summary: 'Get stats for the winners page hero (public)' })
  @ApiResponse({ status: 200, description: 'Winner stats page hero details' })
  getPublicWinnerStats() {
    return this.rafflesService.getPublicWinnerStats();
  }

  @Get('public/recent-winners')
  @ApiOperation({ summary: 'Get recent winners (public)' })
  @ApiResponse({ status: 200, description: 'List of recent winners' })
  getRecentWinners() {
    return this.rafflesService.getRecentWinners();
  }

  @Get('public/winners')
  @ApiOperation({ summary: 'Get paginated winners list (public)' })
  @ApiResponse({ status: 200, description: 'Paginated list of winners' })
  getPublicWinnersList(@Query() query: GetPublicWinnersQueryDto) {
    return this.rafflesService.getPublicWinnersList(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active raffles (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of active public raffles',
  })
  findAllPublic(@Query() query: FindAllPublicRafflesQueryDto) {
    return this.rafflesService.findAllPublic(query);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a single active raffle by slug (public)' })
  @ApiParam({
    name: 'slug',
    description: 'The unique slug string of the active raffle',
  })
  @ApiResponse({
    status: 200,
    description: 'Raffle details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  findOnePublic(@Param('slug') slug: string) {
    return this.rafflesService.findOnePublic(slug);
  }

  // --- HOST ENDPOINTS ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new raffle (Host only)' })
  @ApiResponse({
    status: 201,
    description: 'Raffle successfully created and pending approval',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires active host subscription',
  })
  create(@Req() req: Request, @Body() data: CreateRaffleDto) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.create(hostId, data);
  }

  @Get('host/my-raffles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get raffles for the current host' })
  @ApiResponse({ status: 200, description: 'List of host-owned raffles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findHostRaffles(
    @Req() req: Request,
    @Query() query: FindHostRafflesQueryDto,
  ) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.findHostRaffles(hostId, query);
  }

  @Get('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific raffle for the host' })
  @ApiParam({ name: 'id', description: 'The unique ID of the raffle' })
  @ApiResponse({
    status: 200,
    description: 'Raffle details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  findOneHost(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.findOneHost(id, hostId);
  }

  @Patch('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a draft/pending raffle' })
  @ApiParam({ name: 'id', description: 'The ID of the raffle to update' })
  @ApiResponse({ status: 200, description: 'Raffle updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: UpdateRaffleDto,
  ) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.update(id, hostId, data);
  }

  @Delete('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a raffle' })
  @ApiParam({ name: 'id', description: 'The ID of the raffle to delete' })
  @ApiResponse({ status: 200, description: 'Raffle deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.remove(id, hostId);
  }

  @Post('host/:id/draw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually draw a winner for a competition' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the raffle to draw a winner',
  })
  @ApiResponse({ status: 200, description: 'Winner drawn successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot draw winner (e.g. no tickets sold or not ended)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  drawWinner(@Req() req: Request, @Param('id') id: string) {
    // Optionally check if host owns it in the service
    return this.rafflesService.drawWinner(id);
  }

  @Get('host/:id/winners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all winners (Instant + Main) for a competition',
  })
  @ApiParam({ name: 'id', description: 'Raffle ID' })
  @ApiResponse({
    status: 200,
    description: 'List of winners for the competition',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getWinners(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.getWinners(id, hostId);
  }

  @Post('host/:id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload cover image for a raffle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiParam({ name: 'id', description: 'Raffle ID' })
  @ApiResponse({
    status: 201,
    description: 'Cover image uploaded and updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid image file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/raffles',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async uploadImage(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const hostId = this.extractUserId(req);
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host =
      req.headers['x-forwarded-host'] || req.headers.host || '127.0.0.1:5000';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/uploads/raffles/${file.filename}`;
    return this.rafflesService.updateMainImage(id, hostId, imageUrl);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a generic image for raffle or instant win' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid image file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/raffles',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async uploadGenericImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host =
      req.headers['x-forwarded-host'] || req.headers.host || '127.0.0.1:5000';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/uploads/raffles/${file.filename}`;
    return { url: imageUrl };
  }

  // --- ADMIN ENDPOINTS ---

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending raffles for approval' })
  @ApiResponse({ status: 200, description: 'List of pending raffles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getPendingApprovals() {
    return this.rafflesService.getPendingApprovals();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all raffles for admin management' })
  @ApiResponse({ status: 200, description: 'List of all raffles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllAdmin(@Query() query: FindAllAdminRafflesQueryDto) {
    return this.rafflesService.findAllAdmin(query);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a raffle as an admin' })
  @ApiParam({ name: 'id', description: 'Raffle ID to delete' })
  @ApiResponse({ status: 200, description: 'Raffle deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  adminDelete(@Param('id') id: string) {
    return this.rafflesService.adminDelete(id);
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending raffle' })
  @ApiParam({ name: 'id', description: 'Raffle ID to approve' })
  @ApiResponse({ status: 200, description: 'Raffle approved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Raffle not found' })
  approve(@Param('id') id: string) {
    return this.rafflesService.approve(id);
  }
}
