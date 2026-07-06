import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password is too long' })
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ example: 'London' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: 'CLIENT', enum: ['CLIENT', 'HOST'] })
  @IsOptional()
  @IsString()
  @IsIn(['CLIENT', 'HOST'], { message: 'Role must be either CLIENT or HOST' })
  role?: string;

  @ApiPropertyOptional({ example: 'My Airsoft Business' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessName?: string;
}
