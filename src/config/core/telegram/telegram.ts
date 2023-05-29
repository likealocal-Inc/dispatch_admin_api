import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import { DefaultConfig } from 'src/config/default.config';

/**
 * 텔레그램 처리 유틸
 */
@Injectable()
export class Telegram {
  private bot: TelegramBot;

  constructor() {
    const botId = DefaultConfig.telegram.botKey;
    this.bot = new TelegramBot(botId);
  }

  /**
   * 텔레그램 채팅방 아이디를 얻기 위한 함수
   * 해당 채팅방에 글을 쓰고 내가 마지막으로 쓴 텔레그램 방을 찾는 방법
   */
  async getChatRoomId() {
    const url = `https://api.telegram.org/bot${DefaultConfig.telegram.botKey}/getUpdates`;
    console.log(url);
    const res = await axios.get(url);
    return res.data.result[0].message;

    // this.bot.getUpdates({ allowed_updates: ['message'] }).then((updates) => {
    //   console.log(updates);

    //   const latestMessage = updates[updates.length - 1];
    //   console.log(latestMessage);
    //   return latestMessage;
    // const chatId = latestMessage.chat.id;

    // console.log(`Latest message in chat ${chatId}: ${latestMessage.text}`);
    // });
  }

  /**
   * 메세지 전송
   * @param chatId
   * @param message
   */
  async send(message: string) {
    try {
      await this.bot.sendMessage(DefaultConfig.telegram.chatRoomId, message);
    } catch (error) {
      console.error(error);
    }
  }
}
