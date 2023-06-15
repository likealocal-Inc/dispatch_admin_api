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
import { EnumUpdateLogType } from 'src/config/core/files/log.files';
import { log } from 'console';

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

  async update(id: string, updateOrderDto: UpdateOrderDto, userEmail: string) {
    const before = await this.prisma.orders.findUnique({ where: { id } });
    let order: OrderEntity = await this.prisma.orders.update({
      where: { id: id },
      data: { ...updateOrderDto, status: OrderStatus.DISPATCH_MODIFIED },
    });

    const dtoBefore: UpdateOrderDto = new UpdateOrderDto();
    const dtoAfter: UpdateOrderDto = new UpdateOrderDto();

    const beforeJson = dtoBefore.convertFromEntity(before);
    const afterJson = dtoAfter.convertFromEntity(order);
    DispatchUtils.updateLogFile(
      EnumUpdateLogType.ORDER,
      JSON.stringify(beforeJson),
      JSON.stringify(afterJson),
      order.company + '-' + order.key,
      userEmail,
    );

    // 변경된 데이터 찾아서 JSON 형태로 반환
    const changeDataJson = await DispatchUtils.compareOrderData(before, order);
    // 변겯된 데이터를 JSON데이터로 추가
    const changeData = await DispatchUtils.addDataToJsonType(
      order.else02,
      'update',
      JSON.stringify(changeDataJson),
    );
    order = await this.prisma.orders.update({
      where: { id: order.id },
      data: { else02: JSON.stringify(changeData) },
    });

    // 수정 알림 보내기
    DispatchUtils.updateDispatchRequestStatus(order);
    return order;
  }

  /**
   * 상태값 변경
   * @param orderId
   * @param status
   * @param tx
   * @returns
   */
  async updateStatus(
    orderId: string,
    status: any,
    userEmail: string,
    tx = null,
  ) {
    let order: OrderEntity;

    // 상태값변경 시간을 저장하기 위해서 해당 주문을 조회
    // else02에 json데이터로 저장한다.
    const orderTemp = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });
    let moreInfo = orderTemp.else02;
    if (status === OrderStatus.DISPATCH_REQUEST_CANCEL) {
      moreInfo = JSON.stringify(
        await DispatchUtils.addDataToJsonType(
          moreInfo,
          'dispatch_cancel_time',
          DateUtils.nowString('YYYY/MM/DD hh:mm'),
        ),
      );
    }

    if (tx === null) {
      order = await this.prisma.orders.update({
        where: { id: orderId },
        data: { status: status, else02: moreInfo },
      });
    } else {
      order = await tx.orders.update({
        where: { id: orderId },
        data: { status: status, else02: moreInfo },
      });
    }

    // 업데이트 로그파일
    DispatchUtils.updateLogFile(
      EnumUpdateLogType.STATUS,
      status,
      orderTemp.status,
      order.company + '-' + order.key,
      userEmail,
    );

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
