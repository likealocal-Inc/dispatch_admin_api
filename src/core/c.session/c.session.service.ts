import { Injectable } from '@nestjs/common';
import { CRedisService } from '../c.redis/c.redis.service';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';
import { DefaultConfig } from 'src/config/default.config';

interface SessionValueStructure {
  userId: string;
  token: string;
}

@Injectable()
export class CSessionService {
  constructor(private readonly redisService: CRedisService) {}

  /**
   * 레디스 세선의 키 만들기
   * @param userId
   * @returns
   */
  __makeSessionKey = async (userId): Promise<string> => {
    return await SecurityUtils.createRandomKey(userId);
  };

  /**
   * 사용자아이디와 토큰으로 값 만들기
   * @param userId
   * @param token
   * @returns
   */
  makeTokenAndUserId = ({ userId, token }: SessionValueStructure): string =>
    `${userId}|${token}`;

  /**
   * 세션값에서 userId, token 나누기
   * @param value
   * @returns
   */
  getTokenAndUserId = (value: string): SessionValueStructure => {
    const _data = value.split('|');
    return { userId: _data[0], token: _data[1] };
  };

  /**
   * 세선저장하기
   * @param userId
   * @param token
   * @returns 사용자 세션 키값
   */
  async setSession(userId: string, token: string): Promise<string> {
    const userSessionKey = await this.__makeSessionKey(userId + '');

    const map = new Map<string, string>([
      [userSessionKey, this.makeTokenAndUserId({ userId, token })],
    ]);

    this.redisService.setMap(DefaultConfig.session.getKey(), map);

    return userSessionKey;
  }

  /**
   * 세션불러오기
   * @param userId
   * @returns
   */
  async getSessionByUserId(userId: number) {
    return this.redisService.get({
      key: DefaultConfig.session.getKey(),
      type: 'MAP',
      mapKey: await this.__makeSessionKey(userId),
    });
  }

  /**
   * 세션키로 조회
   * @param sessionKey
   * @returns
   */
  async getSessionBySessionKey(sessionKey: string) {
    const data: any = await this.redisService.get({
      key: DefaultConfig.session.getKey(),
      type: 'MAP',
      mapKey: sessionKey,
    });

    if (data === null) {
      return null;
    }
    return this.getTokenAndUserId(data).token;
  }

  /**
   * 세션지우기
   * @param userId
   * @returns
   */
  async delSession(userId: number): Promise<any> {
    return this.redisService.delMap(
      DefaultConfig.session.getKey(),
      await this.__makeSessionKey(userId),
    );
  }
}
