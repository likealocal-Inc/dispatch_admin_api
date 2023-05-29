import { Module } from '@nestjs/common';
import { CTelegramService } from './c.telegram.service';
import { CTelegramController } from './c.telegram.controller';
import { Telegram } from 'src/config/core/telegram/telegram';

@Module({
  controllers: [CTelegramController],
  providers: [CTelegramService, Telegram],
})
export class CTelegramModule {}
