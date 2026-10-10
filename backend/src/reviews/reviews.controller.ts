import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { extractTokenFromRequest } from '../common/utils/extract-token';

@ApiTags('Reviews')
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const token = extractTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a new review and rating for a won prize' })
  @ApiResponse({ status: 201, description: 'Review submitted successfully' })
  @ApiResponse({ status: 400, description: 'Already reviewed or invalid payload' })
  @ApiResponse({ status: 403, description: 'Not the owner of the winning record' })
  createReview(@Req() req: Request, @Body() dto: CreateReviewDto) {
    const userId = this.extractUserId(req);
    return this.reviewsService.createReview(userId, dto);
  }

  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get all public reviews and statistics for a host profile' })
  @ApiParam({ name: 'hostId', description: 'Host ID or slug' })
  @ApiResponse({ status: 200, description: 'Host reviews list and aggregated metrics' })
  getHostReviews(
    @Param('hostId') hostId: string,
    @Query() query: ReviewQueryDto,
  ) {
    return this.reviewsService.getHostReviews(hostId, query);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all reviews submitted by the current user' })
  @ApiResponse({ status: 200, description: 'List of reviews by user' })
  getMyReviews(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.reviewsService.getMyReviews(userId);
  }

  @Get('host-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST')
  @ApiOperation({ summary: 'Get all reviews for the authenticated host profile' })
  @ApiResponse({ status: 200, description: 'Reviews received by the host' })
  getHostReviewsDashboard(
    @Req() req: Request,
    @Query() query: ReviewQueryDto,
  ) {
    const userId = this.extractUserId(req);
    return this.reviewsService.getHostReviewsDashboard(userId, query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  updateReview(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = this.extractUserId(req);
    return this.reviewsService.updateReview(userId, id, dto);
  }

  @Post(':id/flag')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Flag a review for administrative moderation' })
  @ApiResponse({ status: 200, description: 'Review flagged' })
  flagReview(@Param('id') id: string) {
    return this.reviewsService.flagReview(id);
  }
}
