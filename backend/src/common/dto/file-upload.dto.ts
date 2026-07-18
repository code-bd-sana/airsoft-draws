import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file file to upload',
  })
  file: any;
}
