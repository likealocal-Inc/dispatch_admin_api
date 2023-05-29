import { Test, TestingModule } from '@nestjs/testing';
import { CTelegramController } from './c.telegram.controller';
import { CTelegramService } from './c.telegram.service';

describe('CTelegramController', () => {
  let controller: CTelegramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CTelegramController],
      providers: [CTelegramService],
    }).compile();

    controller = module.get<CTelegramController>(CTelegramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
