import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ApproveSubscriptionRequestDto {
  @ApiProperty({
    description: 'The unique ID of the subscription request to approve',
    example: 'req_123456',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiPropertyOptional({
    description: 'Approved duration in days',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  approvedDays?: number;

  @ApiPropertyOptional({
    description: 'Internal admin notes',
    example: 'Approved after verification.',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
