import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FulfillmentPackagingDto {
  @ApiPropertyOptional({
    description: 'Fulfillment logistics method',
    example: 'COURIER_DELIVERY',
    enum: ['COURIER_DELIVERY', 'IN_PERSON_COLLECTION', 'DIGITAL_TRANSFER'],
  })
  @IsOptional()
  @IsString()
  fulfillmentMethod?: string;

  @ApiPropertyOptional({
    description: 'Packaging type used for RIF shipping',
    example: 'DISCREET_HEAVY_DUTY_BOX',
  })
  @IsOptional()
  @IsString()
  packagingType?: string;

  @ApiPropertyOptional({
    description: 'Confirmation that discreet external non-branded packaging was verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  discreetPackagingConfirmed?: boolean;

  @ApiPropertyOptional({
    description: 'Courier service name',
    example: 'Parcelforce Secure',
  })
  @IsOptional()
  @IsString()
  courierName?: string;

  @ApiPropertyOptional({
    description: 'Courier parcel tracking number',
    example: 'PF-GB-99887766',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Staff member who supervised in-person collection',
    example: 'Mark Evans (Store Manager)',
  })
  @IsOptional()
  @IsString()
  collectionStaffMember?: string;

  @ApiPropertyOptional({
    description: 'Fulfillment delivery status',
    example: 'DELIVERED',
    enum: ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'COLLECTED'],
  })
  @IsOptional()
  @IsString()
  deliveryStatus?: string;
}
