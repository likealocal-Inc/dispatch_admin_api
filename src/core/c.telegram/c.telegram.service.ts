import { Injectable } from '@nestjs/common';
import { TelegramUtils } from 'src/config/core/telegram/telegram.utils';

@Injectable()
export class CTelegramService {
  async getChatRoomId(botKey: string) {
    console.log(botKey);
    return await TelegramUtils.getChatRoomId(botKey);
  }
  /**
   * 메세지 전송
   * @param message
   */
  async send(botKey: string, roomId: string, message: string) {
    return await TelegramUtils.send(botKey, +roomId, message);
  }
}
