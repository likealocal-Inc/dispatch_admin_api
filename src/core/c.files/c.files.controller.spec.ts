import { Test, TestingModule } from '@nestjs/testing';
import { CFilesController } from './c.files.controller';
import { CFilesService } from './c.files.service';

describe('CFilesController', () => {
  let controller: CFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CFilesController],
      providers: [CFilesService],
    }).compile();

    controller = module.get<CFilesController>(CFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
