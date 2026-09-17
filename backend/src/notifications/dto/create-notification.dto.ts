import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Recipient user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description:
      'Type of notification: WIN, PAYMENT, DRAW, APPROVAL, WITHDRAWAL, SYSTEM',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Notification subtitle / description' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Redirect URL / route' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Arbitrary metadata payload' })
  @IsOptional()
  metadata?: any;
}
