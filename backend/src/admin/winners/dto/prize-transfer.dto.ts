import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PrizeTransferDto {
  @ApiProperty({
    description: 'Full name of the designated transfer recipient',
    example: 'Sarah Jenkins',
  })
  @IsString()
  @IsNotEmpty()
  transferRecipientName: string;

  @ApiPropertyOptional({
    description: 'Date of birth of the designated recipient (YYYY-MM-DD)',
    example: '1992-08-20',
  })
  @IsOptional()
  @IsString()
  transferRecipientDob?: string;

  @ApiPropertyOptional({
    description: 'UKARA license number of the designated recipient',
    example: 'UKARA987654',
  })
  @IsOptional()
  @IsString()
  transferRecipientUkara?: string;

  @ApiProperty({
    description: 'Prize transfer status',
    example: 'APPROVED',
    enum: ['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED'],
  })
  @IsString()
  @IsNotEmpty()
  transferStatus: string;

  @ApiPropertyOptional({
    description: 'Internal admin notes regarding recipient verification',
    example: 'Recipient UKARA and 18+ photo ID verified on phone.',
  })
  @IsOptional()
  @IsString()
  transferAdminNotes?: string;
}
