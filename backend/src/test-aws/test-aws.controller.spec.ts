import { Test, TestingModule } from '@nestjs/testing';
import { TestAwsController } from './test-aws.controller';
import { TestAwsService } from './test-aws.service';

describe('TestAwsController', () => {
  let controller: TestAwsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAwsController],
      providers: [TestAwsService],
    }).compile();

    controller = module.get<TestAwsController>(TestAwsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
