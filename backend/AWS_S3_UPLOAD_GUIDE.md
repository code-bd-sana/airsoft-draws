# 🚀 Step-by-Step Guide: How to Upload Image & Video Files to AWS S3 in NestJS

This guide explains how to take the uploaded files from the frontend (`/test-aws`) and upload them to an **AWS S3 Bucket** using NestJS and the official **AWS SDK v3** (`@aws-sdk/client-s3`).

---

## 1. Install AWS SDK v3 Package

Run this command inside the `backend` directory:

```bash
npm install @aws-sdk/client-s3
```

---

## 2. Configure Environment Variables (`.env`)

Add your AWS credentials to `backend/.env`:

```env
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_S3_BUCKET_NAME=your_bucket_name_here
```

---

## 3. Create an S3 Helper / Service (`s3.service.ts` or inside `test-aws.service.ts`)

In `backend/src/test-aws/test-aws.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class TestAwsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'eu-west-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Helper function to upload a single file buffer to AWS S3
   */
  async uploadFileToS3(file: Express.Multer.File, folder: string = 'test-uploads'): Promise<string> {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    
    const key = `${folder}/${randomName}${extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    // Return the public S3 URL
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Main service function called by TestAwsController
   */
  async create(body: any, files: any) {
    const name = body.name || 'Unnamed';

    // 1. Upload Main Image (Single)
    let imageUrl: string | null = null;
    if (files?.image?.[0]) {
      imageUrl = await this.uploadFileToS3(files.image[0], 'images');
    }

    // 2. Upload Gallery Images (Multiple)
    const gallaryUrls: string[] = [];
    if (files?.gallary && files.gallary.length > 0) {
      for (const file of files.gallary) {
        const url = await this.uploadFileToS3(file, 'gallery');
        gallaryUrls.push(url);
      }
    }

    // 3. Upload Video (Single)
    let videoUrl: string | null = null;
    if (files?.video?.[0]) {
      videoUrl = await this.uploadFileToS3(files.video[0], 'videos');
    }

    // 4. Upload Videos (Multiple)
    const videosUrls: string[] = [];
    if (files?.videos && files.videos.length > 0) {
      for (const file of files.videos) {
        const url = await this.uploadFileToS3(file, 'videos');
        videosUrls.push(url);
      }
    }

    return {
      message: 'Files uploaded to AWS S3 successfully!',
      data: {
        name,
        image: imageUrl,
        gallary: gallaryUrls,
        video: videoUrl,
        videos: videosUrls,
      },
    };
  }
}
```

---

## 4. How the Flow Works

1. User selects image and video files on frontend `/test-aws`.
2. Frontend sends `multipart/form-data` to `POST /api/v1/test-aws`.
3. NestJS Multer (`memoryStorage()`) captures files into `file.buffer`.
4. `TestAwsService` sends the buffer to AWS S3 using `PutObjectCommand`.
5. AWS S3 returns the file URL which is sent back to the frontend!
