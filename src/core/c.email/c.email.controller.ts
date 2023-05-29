import { Body, Controller, Post } from '@nestjs/common';
import { CEmailService as CEmailService } from './c.email.service';
import { ApiOperation } from '@nestjs/swagger';
import { EmailSendDto } from './dto/email.send.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';

// @ApiTags('Auth Module')
@Controller('c.email')
export class CEmailController {
  constructor(private readonly cEamilService: CEmailService) {}

  /**
   * 이메일 전송
   * @param emailSendDtop
   * @returns
   */
  @ApiOperation({ summary: '이메일 전송' })
  @Post('/send')
  sendEmail(@Body() emailSendDtop: EmailSendDto): APIResponseObj {
    this.cEamilService.send(emailSendDtop);
    return HttpUtils.makeAPIResponse(true);
  }
}
