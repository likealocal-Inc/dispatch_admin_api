import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CTelegramService } from './c.telegram.service';
import { HttpUtils } from 'src/libs/core/utils/http.utils';

@Controller('c.telegram')
export class CTelegramController {
  constructor(private readonly cTelegramService: CTelegramService) {}

  @Get('/get.chat.room.id')
  async getChatRoomId() {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cTelegramService.getChatRoomId(),
    );
  }

  @Post('/send')
  async send(@Body() body: string) {
    this.cTelegramService.send(body['message']);
    return HttpUtils.makeAPIResponse(true);
  }
}
