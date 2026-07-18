import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllPublicRafflesQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for title, business name or host name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 12,
    default: 12,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'Rifles',
    description: 'Filter by category name (e.g. "Rifles", "Pistols", "All")',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'Live',
    enum: ['Live', 'Upcoming', 'Past'],
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  statusFilter?: string;

  @ApiPropertyOptional({
    example: 'featured',
    enum: [
      'Ending Soon',
      'Price: Low to High',
      'Price: High to Low',
      'Most Popular',
      'featured',
    ],
    description: 'Sort criteria',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    example: 'true',
    enum: ['true', 'false'],
    description: 'Filter only raffles with instant wins',
  })
  @IsOptional()
  @IsString()
  hasInstantWins?: string;
}

export class FindHostRafflesQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'All',
    enum: ['All', 'Live', 'Pending Review', 'Ended', 'Drafts'],
    description: 'Filter by host status',
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetPublicWinnersQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 8,
    default: 8,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'all',
    enum: ['all', 'week', 'month'],
    description: 'Filter winners by time range',
  })
  @IsOptional()
  @IsString()
  activeTab?: string;

  @ApiPropertyOptional({
    example: 'all',
    enum: ['all', 'instant', 'main_draw'],
    description: 'Filter winners by win type',
  })
  @IsOptional()
  @IsString()
  winnerType?: string;

  @ApiPropertyOptional({
    example: 'newest',
    enum: ['newest', 'oldest'],
    description: 'Sort order for winners list',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;
}

export class FindAllAdminRafflesQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for title, host name, or host email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'All',
    enum: ['All', 'Live', 'Pending', 'Ended', 'Rejected', 'Draft'],
    description: 'Filter by admin status mapping',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
