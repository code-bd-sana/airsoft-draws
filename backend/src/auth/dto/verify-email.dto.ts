import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'token_string_here' })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}
