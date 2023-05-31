import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { DefaultConfig } from 'src/config/default.config';
import { NewIamwebOrderModel } from 'src/libs/core/models/iamweb.order.model';
import { IamwebUtils } from 'src/libs/core/utils/iamweb.utils';

@Injectable()
export class IamwebOrderBatch {
  iamwebUtils: IamwebUtils;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.iamwebUtils = new IamwebUtils(this.httpService);
  }

  @Cron('1 * * * * *')
  async orderBatch() {
    const info = '아임웹 주문데이터 조회';
    console.log(`----------- ${info} -------------`);
    const res: NewIamwebOrderModel[] =
      await this.iamwebUtils.getOrderListFromIamweb(this.prisma);

    if (res === undefined) return;

    for (let index = 0; index < res.length; index++) {
      const d = res[index];
      await this.prisma.orders.create({
        data: {
          status: OrderStatus.IAMWEB_ORDER,
          isIamweb: true,
          iamwebOrderNo: d.order_no,

          orderTime: '' + d.order_time,
          orderTitle: d.order_title,

          boardingDate: d.boarding_date + ' ' + d.boarding_time,

          startLocation: d.start_name,
          startAddress: d.start_address,
          startAirport: d.start_airport,

          goalLocation: d.goal_name,
          goalAddress: d.goal_address,
          goalAirport: d.goal_airport,

          information: JSON.stringify(d.info),

          company: 'likealocal',
          else01:
            d.start_goal === ''
              ? ''
              : `{"start_goal":"${d.start_goal}" ,"trip_route":"${d.trip_route}", "timezon":"${d.timezon}"}`,
          else02: '',

          userId: DefaultConfig.iamwebApi.iamwebOrderUserId,
        },
      });
    }
  }
}
