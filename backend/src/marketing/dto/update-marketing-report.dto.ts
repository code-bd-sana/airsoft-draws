import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMarketingReportDto {
  @ApiProperty({
    description: 'Updated report status',
    example: 'RESOLVED',
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'],
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: 'Internal admin resolution notes',
    example: 'Listing reviewed and confirmed fully compliant with prize terms.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
