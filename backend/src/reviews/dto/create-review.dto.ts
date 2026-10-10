import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The ID of the winning record being reviewed',
    example: '2a0c7193-5dea-4965-8c4b-56b9e8674b4d',
  })
  @IsUUID()
  @IsNotEmpty()
  winnerId: string;

  @ApiProperty({
    description: 'Rating score from 1 to 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review comments or feedback for the host',
    example: 'Amazing experience! Fast delivery and great communication.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
