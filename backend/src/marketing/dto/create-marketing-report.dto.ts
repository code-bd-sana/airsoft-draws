import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateMarketingReportDto {
  @ApiPropertyOptional({ description: 'Optional ID of the competition being reported' })
  @IsOptional()
  @IsString()
  raffleId?: string;

  @ApiProperty({ description: 'Reason for the marketing concern report' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'Detailed explanation of the marketing concern' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Optional email of the reporter' })
  @IsOptional()
  @IsEmail()
  reporterEmail?: string;
}
