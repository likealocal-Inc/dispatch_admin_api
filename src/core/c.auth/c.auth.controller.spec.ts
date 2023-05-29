import { Test, TestingModule } from '@nestjs/testing';
import { CAuthController } from './c.auth.controller';
import { CAuthService } from './c.auth.service';

describe('CAuthController', () => {
  let controller: CAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CAuthController],
      providers: [CAuthService],
    }).compile();

    controller = module.get<CAuthController>(CAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
