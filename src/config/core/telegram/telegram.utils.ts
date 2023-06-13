import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';

/**
 * 텔레그램 처리 유틸
 */
export const TelegramUtils = {
  // private bot: TelegramBot;

  // constructor() {
  //   const botId = DefaultConfig.telegram.jin.botKey;
  //   this.bot = new TelegramBot(botId);
  // }

  getBot: async (botKey: string) => {
    const bot: TelegramBot = new TelegramBot(botKey);
    return bot;
  },
  /**
   * 텔레그램 채팅방 아이디를 얻기 위한 함수
   * 해당 채팅방에 글을 쓰고 내가 마지막으로 쓴 텔레그램 방을 찾는 방법
   */
  /**
   * room ID 얻기
   * @param botKey
   * @returns
   */
  getChatRoomId: async (botKey: string) => {
    const url = `https://api.telegram.org/bot${botKey}/getUpdates`;
    const res = await axios.get(url);
    return res.data.result;
  },

  /**
   * 메세지 보내기
   * @param botKey
   * @param chatId
   * @param message
   */
  send: async (botKey: string, chatId: number, message: string) => {
    const url = `https://api.telegram.org/bot${botKey}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
