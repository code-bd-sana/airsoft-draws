import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, IsBoolean } from 'class-validator';

export class PurchaseTicketsDto {
  @ApiProperty({
    example: 5,
    description: 'The number of tickets to purchase',
    minimum: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: '1995-05-15',
    description: 'Date of birth of the purchaser (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({
    example: 'UKARA123456',
    description: 'UKARA registration number (mandatory if purchasing tickets for a RIF competition)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ukaraNumber?: string;

  @ApiProperty({
    example: true,
    description: 'Acceptance of platform Terms & Conditions v1.0',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  acceptedTerms?: boolean;
}
