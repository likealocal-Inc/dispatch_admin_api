import { Module } from '@nestjs/common';
import { CEmailController } from './c.email.controller';
import { CEmailService } from './c.email.service';

@Module({
  controllers: [CEmailController],
  providers: [CEmailService],
  exports: [CEmailService],
})
export class CEmailModule {}
