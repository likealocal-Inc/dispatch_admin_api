import axios from 'axios';
import { DefaultConfig } from 'src/config/default.config';

/**
 * 문자전송
 */
export const TextSendUtils = {
  /**
   * 문자전송
   * @param phones (여러개일경우 ,로 구분해서 작성)
   * @param message
   * @returns
   */
  send: async (phones: string, message: string) => {
    const res = await axios.post(
      DefaultConfig.textMessage.getUrl(phones, message),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data;
  },
};
