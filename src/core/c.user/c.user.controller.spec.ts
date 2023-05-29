import { Test, TestingModule } from '@nestjs/testing';
import { CUserController } from './c.user.controller';
import { CUserService } from './c.user.service';

describe('CUserController', () => {
  let controller: CUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CUserController],
      providers: [CUserService],
    }).compile();

    controller = module.get<CUserController>(CUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
