import { Test, TestingModule } from '@nestjs/testing';
import { CUserService } from './c.user.service';

describe('CUserService', () => {
  let service: CUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CUserService],
    }).compile();

    service = module.get<CUserService>(CUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
