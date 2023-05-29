import { Test, TestingModule } from '@nestjs/testing';
import { CSessionController } from './c.session.controller';
import { CSessionService } from './c.session.service';

describe('CSessionController', () => {
  let controller: CSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CSessionController],
      providers: [CSessionService],
    }).compile();

    controller = module.get<CSessionController>(CSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
