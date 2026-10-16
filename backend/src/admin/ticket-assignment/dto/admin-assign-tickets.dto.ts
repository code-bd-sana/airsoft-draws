import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminAssignTicketsDto {
  @ApiProperty({ description: 'Target raffle / competition ID' })
  @IsString()
  @IsNotEmpty()
  raffleId: string;

  @ApiProperty({ description: 'Target recipient user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Specific ticket numbers to assign (e.g. [7, 14, 21])',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  ticketNumbers?: number[];

  @ApiPropertyOptional({
    description: 'Quantity of random available tickets to assign if specific numbers not provided',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Internal administrative note or reason for assignment',
    example: 'Promotional contest winner',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
