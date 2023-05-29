import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { CEmailModule } from 'src/core/c.email/c.email.module';

@Module({
  imports: [CEmailModule],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
