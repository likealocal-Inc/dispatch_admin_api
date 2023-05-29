import { HttpService } from '@nestjs/axios';
import { IamwebApiUtils } from './iamweb.api.utils';
import { DefaultConfig } from 'src/config/default.config';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { NewIamwebOrderModel } from '../models/iamweb.order.model';
import { PrismaService } from 'src/config/core/prisma/prisma.service';

let tokenString = '';

/**
 * 아임웹 주문 데이터 조회 유틸
 */
export class IamwebUtils {
  apiUtils: IamwebApiUtils;
  constructor(private readonly httpService: HttpService) {
    this.apiUtils = new IamwebApiUtils(httpService);
  }

  /**
   * 액세스 토큰 조회
   * @returns
   */
  async __getAcessToken(isNeedNew = true): Promise<string> {
    if (
      isNeedNew ||
      tokenString === null ||
      tokenString === undefined ||
      tokenString === ''
    ) {
      console.log('++++++++++++++++ 아임웨 토큰 호출 ++++++++++++++++');

      const res = await this.apiUtils.call(process.env.IAMWEB_API_GETTOKEN_URL);
      if (res === undefined) {
        throw new CustomException(ExceptionCodeList.IAMWEB.TOKEN_CANOT_GET);
      }

      const newToken = res['access_token'];
      tokenString = newToken;
      return newToken;
    }
    return tokenString;
  }

  // async __getIamwebRequest(accessToken: string): Promise<any> {
  //   const url = 'https://api.imweb.me/v2/shop/inquirys';
  //   const res = await this.apiUtils.call(
  //     url,
  //     await this.apiUtils.makeHeadersAndParams({ 'access-token': accessToken }),
  //   );

  //   return res;
  // }

  /**
   * 품폭 주문 목록 조회 (https://developers.imweb.me/orders/prodOrders)
   * @param accessToken
   * @param orderId
   * @returns
   */
  async __getIamwebOrderItemList(
    orderId: string,
    accessToken: string,
    iamwebOrderModel: NewIamwebOrderModel,
  ): Promise<NewIamwebOrderModel> {
    const url = `https://api.imweb.me/v2/shop/orders/${orderId}/prod-orders`;
    const res = await this.apiUtils.call(
      url,
      await this.apiUtils.makeHeadersAndParams({ 'access-token': accessToken }),
    );

    if (res === undefined || res.data == undefined) return;

    const item = res.data[0];

    iamwebOrderModel.status = item.status;
    iamwebOrderModel.pay_time = item.pay_time;
    iamwebOrderModel.order_title = item.items[0].prod_name;

    const options = item.items[0].options[0][0];

    for (let index = 0; index < options.option_name_list.length; index++) {
      const iamData = options.option_name_list[index];

      const startName = DefaultConfig.iamwebApi.lang.start_name.filter(
        (d, k) => {
          return iamData.includes(d);
        },
      );
      if (startName.length > 0) {
        iamwebOrderModel.start_name = options.value_name_list[index];
      }

      const startAddress = DefaultConfig.iamwebApi.lang.start_address.filter(
        (d, k) => {
          return iamData.includes(d);
        },
      );
      if (startAddress.length > 0) {
        iamwebOrderModel.start_address = options.value_name_list[index];
      }

      const goalName = DefaultConfig.iamwebApi.lang.goal_name.filter((d, k) => {
        return iamData.includes(d);
      });
      if (goalName.length > 0) {
        iamwebOrderModel.goal_name = options.value_name_list[index];
      }

      const goalAddress = DefaultConfig.iamwebApi.lang.goal_address.filter(
        (d, k) => {
          return iamData.includes(d);
        },
      );
      if (goalAddress.length > 0) {
        iamwebOrderModel.goal_address = options.value_name_list[index];
      }

      const startAirport = DefaultConfig.iamwebApi.lang.start_airport.filter(
        (d, k) => {
          return iamData.includes(d);
        },
      );
      if (startAirport.length > 0) {
        iamwebOrderModel.start_airport = options.value_name_list[index];
        iamwebOrderModel.start_name = options.value_name_list[index];
        iamwebOrderModel.start_address = options.value_name_list[index];
      }

      const goalAirport = DefaultConfig.iamwebApi.lang.goal_airport.filter(
        (d, k) => {
          return iamData.includes(d);
        },
      );
      if (goalAirport.length > 0) {
        iamwebOrderModel.goal_airport = options.value_name_list[index];
        iamwebOrderModel.goal_name = options.value_name_list[index];
        iamwebOrderModel.goal_address = options.value_name_list[index];
      }
    }

    return iamwebOrderModel;
  }

  /**
   * 주문리스트 조회
   * @param accessToken
   * @param startTimeStatmp
   * @param endTimeStatmp
   * @returns
   */
  async __getIamwebOrderList(
    startTimeStatmp: string,
    endTimeStatmp: string,
    accessToken: string,
  ) {
    const res = await this.apiUtils.call(
      'https://api.imweb.me/v2/shop/orders?', //status=PAY_COMPLETE',
      await this.apiUtils.makeHeadersAndParams(
        { 'access-token': accessToken },
        {
          order_date_from: startTimeStatmp.substring(0, 10),
          order_date_to: endTimeStatmp.substring(0, 10),
        },
      ),
    );

    if (res === undefined) return;

    return res['data'];
  }

  /**
   * 상품번호 -> 대절/ 편도 조회
   * 새로 추가 하는것이 대절일 경우 이대로 쓰면됨
   * 새로 추가 하는 것이 편도일 경우 추가가 필요
   * @param productNo
   * @returns
   */
  // async getProductType(productNo: number) {
  //   /**
  //    * 상품
  //    * 프라이빗택시: 133
  //    * 인천/김포공항 픽업: 83 - 편도
  //    * 샌딩: 122 - 편도
  //    */

  //   const type = DefaultConfig.iamwebApi.iamwebProductID;

  //   let typeRes = '대절';
  //   switch (productNo) {
  //     case type.pickup:
  //     case type.sanding:
  //       typeRes = '편도';
  //   }
  //   return typeRes;
  // }

  /**
   * 아임웹 주문 데이터 조회
   * @param iamwebOrderNo
   * @returns
   */
  // async __getIamwebOrder(iamwebOrderNo: string, accessToken: string) {
  //   const res = await this.apiUtils.call(
  //     `https://api.imweb.me/v2/shop/orders/${iamwebOrderNo}`,
  //     await this.apiUtils.makeHeadersAndParams({ 'access-token': accessToken }),
  //   );

  //   if (res === undefined) return;

  //   return res['data'];
  // }

  /**
   * 아엠웹 주문정보 조회
   * @param iamwebOrderNo
   * @returns
   */
  // async getIamwebOrder(iamwebOrderNo: string): Promise<any> {
  //   let accessToken = await this.__getAcessToken();

  //   let res: any = await this.__getIamwebOrder(iamwebOrderNo, accessToken);

  //   const check = await DefaultConfig.iamwebApi.checkNeedNewToken(res['CODE']);
  //   if (check) {
  //     accessToken = await this.__getAcessToken(true);
  //     res = await this.__getIamwebOrder(iamwebOrderNo, accessToken);
  //   }

  //   return res;
  // }
  async sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }
  /**
   * Iamweb 주문 데이터 조회
   * @param accessToken
   * @returns
   */
  async getIamwebOrderList(
    startTimeStatmp: string,
    endTimeStatmp: string,
    prisma: PrismaService,
  ): Promise<NewIamwebOrderModel[]> {
    // 토큰가져오기
    let accessToken = await this.__getAcessToken();

    await this.sleep(1000);

    // 해단 조건의 아엠웹 주문 리스트 조회
    let res: any = await this.__getIamwebOrderList(
      startTimeStatmp,
      endTimeStatmp,
      accessToken,
    );

    if (res === undefined) return;

    await this.sleep(1000);

    const check = await DefaultConfig.iamwebApi.checkNeedNewToken(res['CODE']);
    if (check) {
      accessToken = await this.__getAcessToken(true);
      res = await this.__getIamwebOrderList(
        startTimeStatmp,
        endTimeStatmp,
        accessToken,
      );
    }

    const orderList = res['list'];
    const result = [];
    for (let index = 0; index < orderList.length; index++) {
      const orderData = orderList[index];

      let iamwebOrderModel: NewIamwebOrderModel = new NewIamwebOrderModel(
        orderData,
      );

      // 동일한 아이디로 주문번호가 있는지 조회(아임웹)
      const count: number = await prisma.orders.count({
        where: { iamwebOrderNo: iamwebOrderModel.order_no, isIamweb: true },
      });

      /// order no가 없는것만 가져온다.
      if (count === 0) {
        await this.sleep(1000);
        iamwebOrderModel = await this.__getIamwebOrderItemList(
          orderData.order_no,
          accessToken,
          iamwebOrderModel,
        );

        result.push(iamwebOrderModel);
      }
    }
    return result;
  }

  // /**
  //  * 주문에 대한 요청 조회
  //  * @returns
  //  */
  // async getIamwebRequest(): Promise<any> {
  //   let token = await this.__getAcessToken();

  //   let res: any = await this.__getIamwebRequest(token);
  //   const check = await DefaultConfig.iamwebApi.checkNeedNewToken(res['CODE']);
  //   if (check) {
  //     token = await this.__getAcessToken(true);
  //     res = await this.__getIamwebRequest(token);
  //   }

  //   return res;
  // }

  /**
   * 아엠웹 주문 데이터 조회
   * @returns
   */
  async getOrderListFromIamweb(
    prisma: PrismaService,
  ): Promise<NewIamwebOrderModel[]> {
    // 조회 날짜 세팅
    const today = new Date();
    const fromDay = new Date(today);
    fromDay.setDate(
      today.getDate() - Number(DefaultConfig.iamwebApi.orderSearchDays),
    );

    // 주문리스트를 조회
    const res = await this.getIamwebOrderList(
      fromDay.valueOf().toString(),
      today.valueOf().toString(),
      prisma,
    );

    return res;
  }
}
