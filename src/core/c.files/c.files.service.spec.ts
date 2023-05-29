import { Test, TestingModule } from '@nestjs/testing';
import { CFilesService } from './c.files.service';

describe('CFilesService', () => {
  let service: CFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CFilesService],
    }).compile();

    service = module.get<CFilesService>(CFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
