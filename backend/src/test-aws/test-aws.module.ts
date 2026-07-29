import { Module } from '@nestjs/common';
import { TestAwsService } from './test-aws.service';
import { TestAwsController } from './test-aws.controller';

@Module({
  controllers: [TestAwsController],
  providers: [TestAwsService],
})
export class TestAwsModule {}
