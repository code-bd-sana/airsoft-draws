import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AlternativePrizeDto {
  @ApiProperty({
    description: 'Type of alternative prize provided',
    example: 'CASH_ALTERNATIVE',
    enum: ['CASH_ALTERNATIVE', 'TWO_TONE_CONVERSION', 'VOUCHER', 'NONE'],
  })
  @IsString()
  @IsNotEmpty()
  alternativeType: string;

  @ApiPropertyOptional({
    description: 'Cash value or voucher amount granted (GBP)',
    example: 350.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  alternativeAmount?: number;

  @ApiPropertyOptional({
    description: 'Reason for alternative prize arrangement',
    example: 'Winner lacks UKARA license; opted for cash alternative payout.',
  })
  @IsOptional()
  @IsString()
  alternativeReason?: string;

  @ApiPropertyOptional({
    description: 'Alternative prize processing status',
    example: 'PROCESSED',
    enum: ['OFFERED', 'ACCEPTED', 'DECLINED', 'PROCESSED'],
  })
  @IsOptional()
  @IsString()
  alternativeStatus?: string;
}
