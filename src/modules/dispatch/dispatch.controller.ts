import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { CreateDispatchDto } from './dto/create.dispatch.dto';
import { UpdateDispatchDto } from './dto/update.dispatch.dto';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';
import { HttpUtils } from 'src/libs/core/utils/http.utils';

@AUTH_MUST()
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  async create(@Body() createDispatchDto: CreateDispatchDto, @Req() req: any) {
    createDispatchDto.userId = req.user.id;
    return HttpUtils.makeAPIResponse(
      true,
      await this.dispatchService.create(createDispatchDto),
    );
  }

  // @Get()
  // findAll() {
  //   return this.dispatchService.findAll();
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.dispatchService.findOne(id),
    );
  }

  @Get('order/:id')
  async findOneByOrderId(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.dispatchService.findOneByOrderId(id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDispatchDto: UpdateDispatchDto,
  ) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.dispatchService.update(id, updateDispatchDto),
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dispatchService.remove(+id);
  // }
}
