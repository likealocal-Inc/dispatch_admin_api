import { Test, TestingModule } from '@nestjs/testing';
import { CAuthService } from './c.auth.service';

describe('CAuthService', () => {
  let service: CAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CAuthService],
    }).compile();

    service = module.get<CAuthService>(CAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
