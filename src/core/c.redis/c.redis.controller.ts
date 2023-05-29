import { Controller } from '@nestjs/common';
import { CRedisService } from './c.redis.service';

@Controller('c.redis')
export class CRedisController {
  constructor(private readonly cRedisService: CRedisService) {}
}
