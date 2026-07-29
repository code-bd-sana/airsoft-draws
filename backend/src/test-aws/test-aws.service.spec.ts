import { Test, TestingModule } from '@nestjs/testing';
import { TestAwsService } from './test-aws.service';

describe('TestAwsService', () => {
  let service: TestAwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestAwsService],
    }).compile();

    service = module.get<TestAwsService>(TestAwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
