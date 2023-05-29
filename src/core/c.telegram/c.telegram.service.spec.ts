import { Test, TestingModule } from '@nestjs/testing';
import { CTelegramService } from './c.telegram.service';

describe('CTelegramService', () => {
  let service: CTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CTelegramService],
    }).compile();

    service = module.get<CTelegramService>(CTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
