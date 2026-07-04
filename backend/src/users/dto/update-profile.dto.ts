import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'New York, USA', description: 'User location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Airsoft Events LLC', description: 'Business name (Hosts only)', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;
}
