import { Module } from '@nestjs/common';
import { CTelegramService } from './c.telegram.service';
import { CTelegramController } from './c.telegram.controller';

@Module({
  controllers: [CTelegramController],
  providers: [CTelegramService],
})
export class CTelegramModule {}
