import { Controller, Get } from '@nestjs/common';
import { DevService } from './dev.service';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DefaultConfig } from 'src/config/default.config';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly schduleRegistry: SchedulerRegistry,
  ) {}

  // @Post()
  // create(@Body() createDevDto: CreateDevDto) {
  //   return this.devService.create(createDevDto);
  // }

  @Get('start.job')
  async startJob(): Promise<APIResponseObj> {
    // job 시작
    const job: CronJob = this.schduleRegistry.getCronJob(
      DefaultConfig.schedule.jobName.job2,
    );
    job.start();

    return await HttpUtils.makeAPIResponse(true, 'good');
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.devService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDevDto: UpdateDevDto) {
  //   return this.devService.update(+id, updateDevDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.devService.remove(+id);
  // }
}
