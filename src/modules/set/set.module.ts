import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetController } from './set.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SetController],
  providers: [SetService],
})
export class SetModule {}
