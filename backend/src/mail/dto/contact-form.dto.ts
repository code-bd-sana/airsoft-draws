import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactFormDto {
  @ApiProperty({ example: 'John Doe', description: 'Sender full name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Sender email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+447497113316', description: 'Sender phone / whatsapp number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Question about ticket draw', description: 'Inquiry subject' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'Hello, I would like to know when the next draw takes place.', description: 'Message content' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
