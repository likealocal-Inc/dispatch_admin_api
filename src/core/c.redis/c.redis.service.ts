import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CreateRedisDto } from './dto/create-c.redi.dto';

export interface RedisGetType {
  key: string;
  type: 'STRING' | 'MAP';
  mapKey?: string;
}

@Injectable()
export class CRedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  setMap(key: string, map: Map<string, string>) {
    this.redis.hset(key, map);
  }

  set(createRedisvDto: CreateRedisDto) {
    if (typeof createRedisvDto.value === 'string') {
      this.redis.set(createRedisvDto.key, createRedisvDto.value);
    } else {
      this.redis.hset(createRedisvDto.key, createRedisvDto.value);
    }
  }

  /**
   * 레디스에서 데이터 조회
   * @param redisGetType
   * @returns
   */
  async get(redisGetType: RedisGetType) {
    switch (redisGetType.type) {
      case 'STRING':
        return await this.redis.get(redisGetType.key);
        break;
      case 'MAP':
        if (redisGetType.mapKey === undefined) {
          return await this.redis.hgetall(redisGetType.key);
        } else {
          return await this.redis.hget(redisGetType.key, redisGetType.mapKey);
        }
        break;
    }
  }

  /**
   *
   * @param key
   * @returns
   */
  del(key: string) {
    return this.redis.del(key);
  }

  /**
   *
   * @param key
   * @param mapKey
   * @returns
   */
  delMap(key: string, mapKey: string) {
    return this.redis.hdel(key, mapKey);
  }

  /**
   *
   * @param key
   * @returns
   */
  async isKey(key: string): Promise<boolean> {
    const res = await this.redis.get(key);
    return res == null ? false : true;
  }
}
