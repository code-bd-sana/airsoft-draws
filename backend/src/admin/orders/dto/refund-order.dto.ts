import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefundOrderDto {
  @ApiPropertyOptional({
    example: 'Customer requested cancellation',
    description: 'The reason for the refund request',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
