import { Injectable } from '@nestjs/common';
import { Telegram } from '../../config/core/telegram/telegram';

@Injectable()
export class CTelegramService {
  constructor(private readonly telegram: Telegram) {}

  async getChatRoomId() {
    return await this.telegram.getChatRoomId();
  }
  /**
   * 메세지 전송
   * @param message
   */
  async send(message: string) {
    this.telegram.send(message);
  }
}
