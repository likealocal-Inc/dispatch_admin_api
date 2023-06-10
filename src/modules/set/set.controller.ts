import { Controller, Get } from '@nestjs/common';
import { SetService } from './set.service';

@Controller('set')
export class SetController {
  constructor(private readonly setService: SetService) {}

  @Get()
  async initService() {
    await this.setService.initService();
    return true;
  }
}
