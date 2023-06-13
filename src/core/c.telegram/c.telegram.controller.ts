import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CTelegramService } from './c.telegram.service';
import { HttpUtils } from 'src/libs/core/utils/http.utils';

@Controller('c.telegram')
export class CTelegramController {
  constructor(private readonly cTelegramService: CTelegramService) {}

  @Get('/get.chat.room.id/:botKey')
  async getChatRoomId(@Param('botKey') botKey: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cTelegramService.getChatRoomId(botKey),
    );
  }

  @Post('/send')
  async send(@Body() body: string) {
    await this.cTelegramService.send(
      body['botKey'],
      body['roomId'],
      body['message'],
    );
    return HttpUtils.makeAPIResponse(true);
  }
}
