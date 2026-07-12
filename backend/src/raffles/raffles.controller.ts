import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

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
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // --- PUBLIC ENDPOINTS ---

  @Get()
  @ApiOperation({ summary: 'Get all active raffles (public)' })
  findAllPublic(@Query() query: any) {
    return this.rafflesService.findAllPublic(query);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a single active raffle by slug (public)' })
  findOnePublic(@Param('slug') slug: string) {
    return this.rafflesService.findOnePublic(slug);
  }

  // --- HOST ENDPOINTS ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Create a new raffle (Host only)' })
  create(@Req() req: Request, @Body() data: any) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.create(hostId, data);
  }

  @Get('host/my-raffles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Get raffles for the current host' })
  findHostRaffles(@Req() req: Request, @Query() query: any) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.findHostRaffles(hostId, query);
  }

  @Get('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Get a specific raffle for the host' })
  findOneHost(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.findOneHost(id, hostId);
  }

  @Patch('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Update a draft/pending raffle' })
  update(@Req() req: Request, @Param('id') id: string, @Body() data: any) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.update(id, hostId, data);
  }

  @Delete('host/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Delete a raffle' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.remove(id, hostId);
  }

  @Post('host/:id/draw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Manually draw a winner for a competition' })
  drawWinner(@Req() req: Request, @Param('id') id: string) {
    // Optionally check if host owns it in the service
    return this.rafflesService.drawWinner(id);
  }

  @Get('host/:id/winners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({
    summary: 'Get all winners (Instant + Main) for a competition',
  })
  getWinners(@Req() req: Request, @Param('id') id: string) {
    const hostId = this.extractUserId(req);
    return this.rafflesService.getWinners(id, hostId);
  }

  @Post('host/:id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Upload cover image for a raffle' })
  @ApiConsumes('multipart/form-data')
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
    const imageUrl = `${process.env.APP_URL || 'http://127.0.0.1:5000'}/uploads/raffles/${file.filename}`;
    return this.rafflesService.updateMainImage(id, hostId, imageUrl);
  }
  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Upload a generic image for raffle or instant win' })
  @ApiConsumes('multipart/form-data')
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
    const imageUrl = `${process.env.APP_URL || 'http://127.0.0.1:5000'}/uploads/raffles/${file.filename}`;
    return { url: imageUrl };
  }

  // --- ADMIN ENDPOINTS ---

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all pending raffles for approval' })
  getPendingApprovals() {
    return this.rafflesService.getPendingApprovals();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all raffles for admin management' })
  findAllAdmin(@Query() query: any) {
    return this.rafflesService.findAllAdmin(query);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a raffle as an admin' })
  adminDelete(@Param('id') id: string) {
    return this.rafflesService.adminDelete(id);
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Approve a pending raffle' })
  approve(@Param('id') id: string) {
    return this.rafflesService.approve(id);
  }
}
