import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWinnerDeliveryStatusDto {
  @ApiProperty({
    description: 'Updated shipping / delivery status for the winner',
    example: 'DISPATCHED',
    enum: ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'COLLECTED'],
  })
  @IsString()
  @IsNotEmpty()
  deliveryStatus: string;

  @ApiPropertyOptional({
    description: 'Courier tracking number or delivery reference code',
    example: 'ROYALMAIL-GB123456789',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
