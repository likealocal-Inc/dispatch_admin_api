import { Module } from '@nestjs/common';
import { CFilesService } from './c.files.service';
import { CFilesController } from './c.files.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CFilesController],
  providers: [CFilesService],
})
export class CFilesModule {}
