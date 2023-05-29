import { Module } from '@nestjs/common';
import { CSessionService } from './c.session.service';
import { CSessionController } from './c.session.controller';
import { CRedisModule } from '../c.redis/c.redis.module';

@Module({
  imports: [CRedisModule],
  controllers: [CSessionController],
  providers: [CSessionService],
  exports: [CSessionService],
})
export class CSessionModule {}
