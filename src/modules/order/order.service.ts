import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from '../../libs/core/dtos/paging';
import { CUserService } from 'src/core/c.user/c.user.service';
import { OrderEntity } from './entities/order.entity';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';
import { ListOrderDto } from './dto/list.order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { DispatchUtils } from 'src/libs/core/utils/dispatch.utils';
import { TextSendUtils } from 'src/libs/core/utils/text.send.utils';
import { DateUtils } from 'src/libs/core/utils/date.utils';
import { DefaultConfig } from 'src/config/default.config';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: CUserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const user = await this.userService.findId(userId);

    const order: OrderEntity = await this.prisma.orders.create({
      data: {
        ...createOrderDto,
        userId,
        goalAirport: '',
        startAirport: '',
        isIamweb: false,
        iamwebOrderNo: '',
        status: OrderStatus.DISPATCH_REQUEST,
        else01: '',
        else02: '',
        company: user.company,
        orderTime: '' + Date.now().toString().substring(0, 10),
      },
    });

    DispatchUtils.processStatus(order);

    return order;
  }

  /**
   * 주문 리스트 요청
   * @param pagingDto
   * @returns
   */
  async listOrderWithUser(pagingDto: PagingDto, user: any) {
    const nowUser = await this.userService.findId(user.id);
    const orders = await this.findAll(pagingDto, nowUser);

    const res = { count: orders.count, data: [] };
    const data = [];
    const userMap = new Map<string, CUserEntity>();

    for (let index = 0; index < orders.data.length; index++) {
      const order: OrderEntity = orders.data[index];
      let mapUser: CUserEntity = userMap.get(order.userId);
      if (mapUser === null || mapUser == undefined) {
        mapUser = await this.userService.findId(order.userId);
      }
      const listOrderDto: ListOrderDto = new ListOrderDto(order);
      listOrderDto.user = mapUser;

      data.push(listOrderDto);
    }

    res.data = data;

    return res;
  }

  async findAll(pagingDto: PagingDto, user = null) {
    let count;
    let orders;
    const skip = +pagingDto.page * +pagingDto.size;
    const take = +pagingDto.size;
    const condition = JSON.parse(pagingDto.condition);

    await this.prisma.$transaction(async (tx) => {
      let where: any = {};

      // User 정보가 있고 일반 사용자(업체)면 해당 업체의 테이터만 조회
      if (user !== null && user.role === Role.USER) {
        where = { ...where, company: user.company };
      }

      // 상태값
      if (condition.status !== undefined && condition.status !== 'ALL') {
        where = { ...where, status: condition.status };
      }

      // 업체
      if (condition.company !== undefined && condition.company !== 'ALL') {
        where = { ...where, company: condition.company };
      }
      count = await tx.orders.count({ where });
      orders = await tx.orders.findMany({
        where,
        skip,
        take,
        orderBy: { orderTime: 'desc' },
      });
    });
    return {
      count,
      data: orders,
    };
  }

  async findOne(id: string) {
    return await this.prisma.orders.findFirst({ where: { id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order: OrderEntity = await this.prisma.orders.update({
      where: { id: id },
      data: { ...updateOrderDto, status: OrderStatus.DISPATCH_MODIFIED },
    });

    // 수정 알림 보내기
    DispatchUtils.updateDispatchRequestStatus(order);
    return order;
  }

  /**
   * 상태값 변경
   * @param id
   * @param status
   * @param tx
   * @returns
   */
  async updateStatus(id: string, status: any, tx = null) {
    let order: OrderEntity;

    const orderTemp = await this.prisma.orders.findUnique({ where: { id } });
    let moreInfo = orderTemp.else02;
    if (status === OrderStatus.DISPATCH_REQUEST_CANCEL) {
      const moreInfoJson = JSON.parse(moreInfo === '' ? '{}' : moreInfo);
      moreInfoJson['dispatch_cancel_time'] =
        DateUtils.nowString('YYYY/MM/DD hh:mm');
      moreInfo = JSON.stringify(moreInfoJson);
    }

    if (tx === null) {
      order = await this.prisma.orders.update({
        where: { id },
        data: { status: status, else02: moreInfo },
      });
    } else {
      order = await tx.orders.update({
        where: { id },
        data: { status: status, else02: moreInfo },
      });
    }
    DispatchUtils.processStatus(order);
  }

  /**
   * 문자전송
   * @param phones
   * @param txt
   * @param orderId
   * @param isJini
   * @returns
   */
  async sendTxt(phones: string, txt: string, orderId: string, isJini: boolean) {
    // 지니에게 보내는것일 경우 order에 세팅
    if (isJini) {
      await this.prisma.orders.update({
        where: { id: orderId },
        data: { isJiniSendTxt: true },
      });
    }
    return await TextSendUtils.send(phones, txt);
  }
}
