import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUsersQueryDto {
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
    example: 'John',
    description: 'Search query for user name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'CLIENT',
    enum: ['CLIENT', 'HOST', 'ADMIN'],
    description: 'Filter by user role',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: 'All',
    enum: ['All', 'Active', 'Blocked'],
    description: 'Filter by user status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 'spent',
    enum: ['createdAt', 'tickets', 'spent', 'name'],
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
