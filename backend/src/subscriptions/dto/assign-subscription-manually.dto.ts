import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AssignSubscriptionManuallyDto {
  @ApiProperty({
    description: 'The unique host profile ID',
    example: 'hp_123456',
  })
  @IsString()
  @IsNotEmpty()
  hostProfileId: string;

  @ApiProperty({
    description: 'The unique ID of the plan to grant',
    example: 'plan_premium_monthly',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({
    description: 'Granted duration in days (defaults to 30)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  durationDays?: number;

  @ApiPropertyOptional({
    description: 'Internal admin notes for manual assignment',
    example: 'Complimentary partnership subscription.',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
