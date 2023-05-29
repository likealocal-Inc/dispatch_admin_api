import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from '../../libs/core/dtos/paging';
import { CUserService } from 'src/core/c.user/c.user.service';
import { OrderEntity } from './entities/order.entity';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';
import { ListOrderDto } from './dto/list.order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: CUserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    return this.prisma.orders.create({
      data: {
        ...createOrderDto,
        userId,
        goalAirport: '',
        startAirport: '',
        isIamweb: false,
        iamwebOrderNo: '',
        else01: '',
        else02: '',
        orderTime: '' + Date.now().toString().substring(0, 10),
      },
    });
  }

  /**
   * 주문 리스트 요청
   * @param pagingDto
   * @returns
   */
  async listOrderWithUser(pagingDto: PagingDto) {
    const orders = await this.findAll(pagingDto);
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

  async findAll(pagingDto: PagingDto) {
    let count;
    let orders;
    const skip = +pagingDto.page * +pagingDto.size;
    const take = +pagingDto.size;

    await this.prisma.$transaction(async (tx) => {
      count = await tx.orders.count();
      orders = await tx.orders.findMany({
        skip,
        take,
        orderBy: { created: 'desc' },
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
    return this.prisma.orders.update({
      where: { id: id },
      data: updateOrderDto,
    });
  }

  /**
   * 아임웹주문에서 배차요청하기
   * @param id
   * @returns
   */
  async updateStatus(id: string, status: any, tx = null) {
    if (tx === null) {
      return await this.prisma.orders.update({
        where: { id },
        data: { status: status },
      });
    } else {
      return await tx.orders.update({
        where: { id },
        data: { status: status },
      });
    }
  }
}
