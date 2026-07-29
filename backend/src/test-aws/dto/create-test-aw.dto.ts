import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestAwDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsOptional()
  gallary: string[];

  @IsString()
  @IsOptional()
  video: string;

  @IsArray()
  @IsOptional()
  videos: string[];
}
