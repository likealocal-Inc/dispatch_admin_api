import { Module } from '@nestjs/common';
import { CScheduleService } from './c.schedule.service';

@Module({
  providers: [CScheduleService],
})
export class CScheduleModule {}
