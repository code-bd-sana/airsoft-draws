import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminWinnersQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'PENDING',
    enum: ['PENDING', 'SHIPPED', 'DELIVERED'],
    description: 'Filter by delivery status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 'PENDING',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    description: 'Filter by verification status',
  })
  @IsOptional()
  @IsString()
  verificationStatus?: string;

  @ApiPropertyOptional({
    example: 'MAIN_DRAW',
    enum: ['MAIN_DRAW', 'INSTANT_WIN'],
    description: 'Filter by win type',
  })
  @IsOptional()
  @IsString()
  winType?: string;
}
