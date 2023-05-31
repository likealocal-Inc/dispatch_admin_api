import {
  createCipheriv,
  createHash,
  randomBytes,
  createDecipheriv,
} from 'crypto';
import * as bcrypt from 'bcrypt';
import { DefaultConfig } from 'src/config/default.config';
import CryptoJS from 'crypto-js';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

/**
 * 암호화
 */
export const SecurityUtils = {
  alg: 'aes-256-ctr',

  _key: DefaultConfig.security.getKey(),

  key: createHash('sha256')
    .update(String('key'))
    .digest('base64')
    .substr(0, 32),

  /**
   * 암호화
   * @param text
   * @returns
   */
  encryptData: async (data: any): Promise<string> => {
    return CryptoJS.AES.encrypt(data, SecurityUtils.key);
  },

  /**
   * 복호화
   * @param text
   * @returns
   */
  decryptData: async (_data: any): Promise<string> => {
    try {
      const bytes = CryptoJS.AES.decrypt(_data, SecurityUtils.key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      throw new CustomException(ExceptionCodeList.ERROR, '복호화오류');
    }
  },

  /**
   * 단방향 암호화
   * @param data
   * @returns
   */
  oneWayEncryptData: async (data: string): Promise<string> => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data, saltOrRounds);
    return hash;
  },

  /**
   * 암호화 데이터 비교
   * @param hash 암호화데이터
   * @param data 원본데이터
   * @returns
   */
  oneWayCompareBcryptData: async (
    hash: string,
    data: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(data, hash);
  },

  /**
   * 랜덤키 만들기
   */
  createRandomKey: async (data: string, size = 38): Promise<string> => {
    const key = await createHash('sha256')
      .update(String(data))
      .digest('base64')
      .substr(0, size);
    return key.replace(/\//g, '');
  },
};
