import { Injectable } from '@nestjs/common';
import { CreateDispatchDto } from './dto/create.dispatch.dto';
import { UpdateDispatchDto } from './dto/update.dispatch.dto';
import { PrismaService } from '../../config/core/prisma/prisma.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class DispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  async create(createDispatchDto: CreateDispatchDto) {
    //return await this.prisma.dispatch.create({ data: createDispatchDto });
    let res;
    await this.prisma.$transaction(async (tx) => {
      // 상태값 변경 값이 들어 오면 업데이트 처리 한다.
      if (createDispatchDto.dispatchStatus !== '') {
        await this.orderService.updateStatus(
          createDispatchDto.orderId,
          createDispatchDto.dispatchStatus,
          tx,
        );
      }
      res = await tx.dispatch.create({
        data: {
          carCompany: createDispatchDto.carCompany,
          jiniName: createDispatchDto.jiniName,
          carInfo: createDispatchDto.carInfo,
          jiniPhone: createDispatchDto.jiniPhone,
          baseFare: createDispatchDto.baseFare,
          addFare: createDispatchDto.addFare,
          totalFare: createDispatchDto.totalFare,
          else01: createDispatchDto.else01,
          else02: createDispatchDto.else02,
          else03: createDispatchDto.else03,
          orderId: createDispatchDto.orderId,
          userId: createDispatchDto.userId,

          // 2023.06.09 추가
          carType: createDispatchDto.carType,
          payType: createDispatchDto.payType,
          memo: createDispatchDto.memo,
          exceedFare: createDispatchDto.exceedFare,
        },
      });
    });

    return res;
  }

  async findOne(id: string) {
    return await this.prisma.dispatch.findFirst({ where: { id } });
  }

  async findOneByOrderId(orderId: string) {
    return await this.prisma.dispatch.findFirst({ where: { orderId } });
  }

  async update(id: string, updateDispatchDto: UpdateDispatchDto) {
    let res;
    await this.prisma.$transaction(async (tx) => {
      // 상태값 변경 값이 들어 오면 업데이트 처리 한다.
      if (updateDispatchDto.dispatchStatus !== '') {
        await this.orderService.updateStatus(
          updateDispatchDto.orderId,
          updateDispatchDto.dispatchStatus,
          tx,
        );
      }
      console.log(updateDispatchDto);
      res = await tx.dispatch.update({
        where: { id },
        data: {
          carCompany: updateDispatchDto.carCompany,
          jiniName: updateDispatchDto.jiniName,
          carInfo: updateDispatchDto.carInfo,
          jiniPhone: updateDispatchDto.jiniPhone,
          baseFare: updateDispatchDto.baseFare,
          addFare: updateDispatchDto.addFare,
          totalFare: updateDispatchDto.totalFare,
          else01: updateDispatchDto.else01,
          else02: updateDispatchDto.else02,
          else03: updateDispatchDto.else03,
          orderId: updateDispatchDto.orderId,

          // 2023.06.09 추가
          carType: updateDispatchDto.carType,
          payType: updateDispatchDto.payType,
          memo: updateDispatchDto.memo,
          exceedFare: updateDispatchDto.exceedFare,
        },
      });
    });

    return res;
  }
}
