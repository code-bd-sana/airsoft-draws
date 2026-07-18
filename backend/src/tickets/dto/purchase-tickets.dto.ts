import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

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
}
