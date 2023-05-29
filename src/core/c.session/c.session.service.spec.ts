import { Test, TestingModule } from '@nestjs/testing';
import { CSessionService } from './c.session.service';

describe('CSessionService', () => {
  let service: CSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CSessionService],
    }).compile();

    service = module.get<CSessionService>(CSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
