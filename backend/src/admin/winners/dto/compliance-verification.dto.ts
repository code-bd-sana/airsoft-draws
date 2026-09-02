import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComplianceVerificationDto {
  @ApiProperty({
    description: 'Updated overall KYC / UKARA compliance verification status',
    example: 'APPROVED',
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXEMPT'],
  })
  @IsString()
  @IsNotEmpty()
  verificationStatus: string;

  @ApiPropertyOptional({
    description: 'Specific UKARA database validity status',
    example: 'VALID',
    enum: ['VALID', 'EXPIRED', 'INVALID', 'NOT_FOUND', 'PENDING'],
  })
  @IsOptional()
  @IsString()
  ukaraStatus?: string;

  @ApiPropertyOptional({
    description: 'Whether winner ID date of birth matches and confirms 18+ age',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  dobMatch?: boolean;

  @ApiPropertyOptional({
    description: 'Whether winner ID full name matches registration and ticket name',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  nameMatch?: boolean;
}
