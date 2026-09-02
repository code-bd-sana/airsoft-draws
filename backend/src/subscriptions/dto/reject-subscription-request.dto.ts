import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RejectSubscriptionRequestDto {
  @ApiProperty({
    description: 'The unique ID of the subscription request to reject',
    example: 'req_123456',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiPropertyOptional({
    description: 'Reason for rejection provided to the host',
    example: 'Please complete host profile verification before requesting premium tier.',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
