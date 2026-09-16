import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BasketCheckoutItemDto {
  @ApiProperty({
    example: 'd9b2d63d-a232-4d8e-b816-1f9fbd348a71',
    description: 'Unique identifier of the raffle competition',
  })
  @IsString()
  @IsNotEmpty()
  raffleId: string;

  @ApiProperty({
    example: 3,
    description: 'Number of tickets to purchase for this competition',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ShippingDetailsDto {
  @ApiProperty({
    example: '573 South Oak Lane',
    description: 'Primary street address',
  })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'Secondary street / unit address',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    example: 'London',
    description: 'Town or city',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'SW1A 1AA',
    description: 'Postal / ZIP code',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    example: 'United Kingdom',
    description: 'Destination country',
    default: 'United Kingdom',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class BasketCheckoutDto {
  @ApiProperty({
    type: [BasketCheckoutItemDto],
    description: 'Array of competition items and ticket quantities to purchase',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasketCheckoutItemDto)
  items: BasketCheckoutItemDto[];

  @ApiProperty({
    example: 'Jade',
    description: 'Purchaser first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Weeks',
    description: 'Purchaser last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Purchaser email for order confirmation and ticket receipts',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+44 7700 900077',
    description: 'Contact phone for delivery and logistics updates',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '1995-05-15',
    description: 'Date of birth for statutory 18+ verification (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    type: ShippingDetailsDto,
    description: 'Prize shipping and fulfillment address',
  })
  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingAddress: ShippingDetailsDto;

  @ApiProperty({
    example: 'UKARA123456',
    description: 'UKARA registration number (mandatory if basket contains RIF items)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ukaraNumber?: string;

  @ApiProperty({
    example: true,
    description: 'Explicit acceptance of terms and conditions v1.0',
  })
  @IsBoolean()
  acceptedTerms: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether to save shipping and contact details back to user profile',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  saveToProfile?: boolean;
}
