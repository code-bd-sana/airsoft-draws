import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWithdrawalStatusDto {
  @ApiProperty({
    description: 'Updated withdrawal payout status',
    example: 'APPROVED',
    enum: ['APPROVED', 'COMPLETED', 'REJECTED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'COMPLETED', 'REJECTED'], {
    message: 'Status must be APPROVED, COMPLETED, or REJECTED',
  })
  status: 'APPROVED' | 'COMPLETED' | 'REJECTED';

  @ApiPropertyOptional({
    description: 'Administrative processing notes or rejection reason',
    example: 'Bank payout dispatched via Faster Payments reference AIR-9922.',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
