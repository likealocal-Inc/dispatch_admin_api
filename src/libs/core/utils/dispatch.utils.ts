import { OrderStatus } from '@prisma/client';
import { SendDispatchTelegramUtils } from './send.dispatch.message';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { EnumUpdateLogType, LogFiles } from 'src/config/core/files/log.files';

export const DispatchUtils = {
  processStatus: async (order: OrderEntity) => {
    /// 배차요청
    if (order.status === OrderStatus.DISPATCH_REQUEST) {
      await SendDispatchTelegramUtils.dispatchRequest(
        order.company,
        `${order.company}-${order.key}`,
      );
      // 배차요청 취소
    } else if (order.status === OrderStatus.DISPATCH_REQUEST_CANCEL) {
      await SendDispatchTelegramUtils.dispatchRequestCancel(
        order.company,
        `${order.company}-${order.key}`,
      );
    }
  },
  updateDispatchRequestStatus: async (order: OrderEntity) => {
    /// 배차요청
    await SendDispatchTelegramUtils.dispatchRequestInfoChange(
      order.company,
      `${order.company}-${order.key}`,
    );
  },
  updateLogFile: async (
    type: EnumUpdateLogType,
    before: string,
    after: string,
    id: string,
    userEmail: string,
  ) => {
    await new LogFiles().update(before, after, type, id, userEmail);
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  addDataToJsonType: async (strData, key, value): Promise<{}> => {
    const moreInfoJson = JSON.parse(strData === '' ? '{}' : strData);
    moreInfoJson[key] = value;
    return moreInfoJson;
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  compareOrderData: async (before, after): Promise<{}> => {
    const res = {};
    res['orderTitle'] =
      before.orderTitle !== after.orderTitle ? before.orderTitle : '';
    res['boardingDate'] =
      before.boardingDate !== after.boardingDate ? before.boardingDate : '';
    res['startLocation'] =
      before.startLocation !== after.startLocation ? before.startLocation : '';
    res['startAddress'] =
      before.startAddress !== after.startAddress ? before.startAddress : '';
    res['goalLocation'] =
      before.goalLocation !== after.goalLocation ? before.goalLocation : '';
    res['goalAddress'] =
      before.goalAddress !== after.goalAddress ? before.goalAddress : '';
    res['startAirport'] =
      before.startAirport !== after.startAirport ? before.startAirport : '';
    res['goalAirport'] =
      before.goalAirport !== after.goalAirport ? before.goalAirport : '';
    res['information'] =
      before.information !== after.information ? before.information : '';
    res['customName'] =
      before.customName !== after.customName ? before.customName : '';
    res['customPhone'] =
      before.customPhone !== after.customPhone ? before.customPhone : '';
    res['else01'] = before.else01 !== after.else01 ? before.else01 : '';
    return res;
  },
};
