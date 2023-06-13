import { OrderStatus } from '@prisma/client';
import { SendDispatchTelegramUtils } from './send.dispatch.message';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

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
};