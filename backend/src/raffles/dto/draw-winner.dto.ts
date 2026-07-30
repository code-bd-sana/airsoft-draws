import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class DrawWinnerDto {
  @ApiPropertyOptional({
    example: 42,
    description: 'Optional specific ticket number to manually declare as winner',
  })
  @IsOptional()
  @IsNumber()
  winningTicketNumber?: number;
}
