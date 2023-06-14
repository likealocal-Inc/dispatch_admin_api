import { Controller, Get, Param } from '@nestjs/common';
import { LogService } from './log.service';
import { LogFiles } from 'src/config/core/files/log.files';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('update/:year/:month/:day')
  async getLog(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
  ) {
    const res = [];
    const logFile = new LogFiles();
    const fileList = await logFile.getUpdateFiles({ year, month, day });
    for (let index = 0; index < fileList.length; index++) {
      const f = fileList[index];
      const data = await logFile.readUpdateFile(f);
      const jsonData = JSON.parse(`[${data.slice(0, -2)}]`);
      res.push(jsonData);
    }
    return res;
  }
}
