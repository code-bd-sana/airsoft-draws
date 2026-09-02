import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSubscriptionRequestDto {
  @ApiProperty({
    description: 'The unique ID of the subscription plan requested',
    example: 'plan_standard_monthly',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({
    description: 'Custom duration in days (optional)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  requestedDays?: number;

  @ApiPropertyOptional({
    description: 'Host request notes or justification for admin review',
    example: 'Requesting monthly standard plan upgrade.',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
