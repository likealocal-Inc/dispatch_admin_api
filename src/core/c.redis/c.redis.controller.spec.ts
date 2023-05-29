import { Test, TestingModule } from '@nestjs/testing';
import { CRedisController } from './c.redis.controller';
import { CRedisService } from './c.redis.service';

describe('CRedisController', () => {
  let controller: CRedisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CRedisController],
      providers: [CRedisService],
    }).compile();

    controller = module.get<CRedisController>(CRedisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
