import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TestAwsService } from './test-aws.service';

@Controller('api/v1/test-aws')
export class TestAwsController {
  constructor(private readonly testAwsService: TestAwsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallary', maxCount: 10 },
        { name: 'video', maxCount: 1 },
        { name: 'videos', maxCount: 10 },
      ],
      {
        storage: memoryStorage(), // Holds file buffers in memory for AWS S3 upload
      },
    ),
  )
  create(@Body() body: any, @UploadedFiles() files: any) {
    return this.testAwsService.create(body, files);
  }
}
