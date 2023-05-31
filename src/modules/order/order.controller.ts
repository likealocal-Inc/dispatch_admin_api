import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';
import { PagingDto } from 'src/libs/core/dtos/paging';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { OrderStatus } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @AUTH_MUST()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const user = req.user;
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.create(createOrderDto, user.id),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }

  @AUTH_MUST()
  @Get()
  async findAll(@Query() pagingDto: PagingDto, @Req() req: any) {
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.listOrderWithUser(pagingDto, req.user),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }

  @AUTH_MUST()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.findOne(id),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }

  @AUTH_MUST()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.update(id, updateOrderDto),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }

  /**
   * 아임웹 주문 요청
   * @param id
   * @returns
   */
  @AUTH_MUST()
  @Patch('status/:id')
  async updateDispatchRequestForIamweb(@Param('id') id: string) {
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.updateStatus(id, OrderStatus.DISPATCH_ING),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }
}
