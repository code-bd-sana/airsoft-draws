import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutSubscriptionDto {
  @ApiProperty({
    example: 'plan-uuid-value',
    description: 'The ID of the subscription plan to checkout',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}
