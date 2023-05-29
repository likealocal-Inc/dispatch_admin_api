import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { CRedisService } from './c.redis.service';
import { CRedisController } from './c.redis.controller';
import { DefaultConfig } from 'src/config/default.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: DefaultConfig.redis.getURL(),
        },
      }),
    }),
  ],
  controllers: [CRedisController],
  providers: [CRedisService],
  exports: [CRedisService],
})
export class CRedisModule {}
