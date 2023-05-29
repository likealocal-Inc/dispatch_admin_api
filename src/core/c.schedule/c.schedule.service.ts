import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DefaultConfig } from 'src/config/default.config';

@Injectable()
export class CScheduleService {
  private readonly logger = new Logger(CScheduleService.name);
  constructor(private readonly schduleRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  addCronJob() {
    const job1 = new CronJob('* * * * * *', () => {
      console.log('Run Cron ' + DefaultConfig.schedule.jobName.job1);
    });
    this.schduleRegistry.addCronJob(DefaultConfig.schedule.jobName.job1, job1);
    console.log('원래 로직');

    const job2 = new CronJob('* * * * * *', () => {
      console.log('Run Cron ' + DefaultConfig.schedule.jobName.job2);
    });
    this.schduleRegistry.addCronJob(DefaultConfig.schedule.jobName.job2, job2);
    console.log('원래 로직');
  }
}
