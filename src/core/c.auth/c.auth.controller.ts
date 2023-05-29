import { Controller, Post, Body, Logger, Req } from '@nestjs/common';
import { CAuthService } from './c.auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CUserEntity } from '../c.user/entities/c.user.entity';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { CreateCUserDto } from '../c.user/dto/create.c.user.dto';
import { EmailLoginDto } from './dto/email.login.dto';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';

@ApiBearerAuth()
@ApiTags('Auth Module')
@Controller('c.auth')
export class CAuthController {
  private readonly logger = new Logger(CAuthController.name);

  constructor(private readonly cAuthService: CAuthService) {}

  @ApiOperation({ summary: '이메일 회원가입' })
  @ApiCreatedResponse({ type: CUserEntity })
  @Post('/join/email')
  async joinEmail(
    @Body() createJoinDto: CreateCUserDto,
  ): Promise<APIResponseObj> {
    const res = await this.cAuthService.joinEmail(createJoinDto);
    return await HttpUtils.makeAPIResponse(true, res);
  }

  @ApiOperation({ summary: '이메일 로그인' })
  @ApiCreatedResponse({ type: CUserEntity })
  @Post('/login/email')
  async loginEmail(
    @Body() emailLoginDto: EmailLoginDto,
  ): Promise<APIResponseObj> {
    return await HttpUtils.makeAPIResponse(
      true,
      await this.cAuthService.loginEmail(emailLoginDto),
    );
  }

  @AUTH_MUST()
  @ApiOperation({ summary: '로그아웃' })
  @ApiCreatedResponse({ type: CUserEntity })
  @Post('/logout')
  async logout(@Req() req: any): Promise<APIResponseObj> {
    return await HttpUtils.makeAPIResponse(
      true,
      await this.cAuthService.logout(req.user.id),
    );
  }

  @AUTH_MUST()
  @ApiOperation({ summary: '토큰 확인' })
  @ApiCreatedResponse({ type: CUserEntity })
  @Post('/check/token')
  async checkToken(@Req() req: any): Promise<APIResponseObj> {
    return await HttpUtils.makeAPIResponse(true, req.user);
  }

  // @ApiOperation({ summary: 'SNS 회원가입' })
  // @ApiCreatedResponse({ type: CUserEntity })
  // @Post('/join/sns')
  // async joinSns(@Body() createJoinDto: CreateJoinEmailDto) {
  //   return this.cAuthService.join(createJoinDto);
  // }
}
