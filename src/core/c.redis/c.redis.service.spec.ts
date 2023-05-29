import { Test, TestingModule } from '@nestjs/testing';
import { CRedisService } from './c.redis.service';

describe('CRedisService', () => {
  let service: CRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CRedisService],
    }).compile();

    service = module.get<CRedisService>(CRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
