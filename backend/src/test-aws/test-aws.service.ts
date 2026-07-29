import {
  CreateBucketCommand,
  ListBucketsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestAwsService {
  private readonly s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566', // Flucli/LocalStack endpoint
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }
  async create(body: any, files: any) {
    // 1. Create a bucket first! (LocalStack starts empty)
    try {
      await this.s3.send(new CreateBucketCommand({ Bucket: 'test-bucket' }));
      console.log('Successfully created "test-bucket"!');
    } catch (error: unknown) {
      // Ignore if it already exists
      if (
        error instanceof Error &&
        error?.name !== 'BucketAlreadyExists' &&
        error?.name !== 'BucketAlreadyOwnedByYou'
      ) {
        console.error('Error creating bucket:', error);
      }
    }

    // 2. Now list the buckets
    const result = await this.s3.send(new ListBucketsCommand());

    try {
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    console.log(body, files);

    return {
      message:
        'Payload received in NestJS! Implement your AWS S3 upload logic here.',
    };
  }
}
// export const s3 = new S3Client({
//   endpoint: 'http://localhost:4500',
//   forcePathStyle: true,
// });
