import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CreateCUserDto } from './dto/create.c.user.dto';
import { UpdateCUserDto } from './dto/update.c.user.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CUserEntity } from './entities/c.user.entity';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';
import { FindUserDto as FindUserDto } from './dto/find.user.dto';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

/**
 * 사용자
 */
@ApiBearerAuth()
@ApiTags('User Module')
@Controller('c.user')
export class CUserController {
  constructor(private readonly cUserService: CUserService) {}

  /**
   * 사용자 추가
   * @param createCUserDto
   * @returns
   */
  @AUTH_MUST()
  @Post()
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async create(
    @Body() createCUserDto: CreateCUserDto,
  ): Promise<APIResponseObj> {
    const res = await this.cUserService.create(createCUserDto);
    return HttpUtils.makeAPIResponse(true, res);
  }

  /**
   * 사용자 전체 조회
   * @returns
   */
  @AUTH_MUST()
  @Get()
  @ApiCreatedResponse({ type: CUserEntity, isArray: true })
  async findAll(@Query() findUserDto: FindUserDto): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.findAllPaging(findUserDto),
    );
  }

  /**
   * 사용자 아이디 조회
   * @param id
   * @returns
   */
  @AUTH_MUST()
  @Get(':id')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async findOne(@Param('id') id: string): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(true, this.cUserService.findId(id));
  }

  /**
   * 사용자 업데이트
   * @param id
   * @param updateCUserDto
   * @returns
   */
  @AUTH_MUST()
  @Patch(':id')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async update(
    @Param('id') id: string,
    @Body() updateCUserDto: UpdateCUserDto,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.update(id, updateCUserDto),
    );
  }

  @AUTH_MUST()
  @Patch()
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async updateUser(
    @Body() updateCUserDto: UpdateCUserDto,
    @Req() req: any,
  ): Promise<APIResponseObj> {
    if (req.user.email !== updateCUserDto.email) {
      throw new CustomException(ExceptionCodeList.AUTH.WRONG_REQUEST_AUTH);
    }

    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.update(req.user.id, updateCUserDto),
    );
  }

  @AUTH_MUST()
  @Patch(':id/:active')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async updateActive(
    @Param('id') id: string,
    @Param('active') active: string,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.updateAcive(id, active === 'true' ? true : false),
    );
  }

  /**
   * 사용자 삭제
   * @param id
   * @returns
   */
  @AUTH_MUST()
  @Delete(':id')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async remove(@Param('id') id: string): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(true, await this.cUserService.remove(id));
  }

  @AUTH_MUST()
  @Post('/me')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async me(@Req() req: any): Promise<APIResponseObj> {
    console.log(req.user);
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.findId(req.user.id),
    );
  }
  @AUTH_MUST()
  @Get('/user/:id')
  @ApiCreatedResponse({ type: CUserEntity, isArray: false })
  async findUser(@Param('id') id: string): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(true, await this.cUserService.findId(id));
  }
}
