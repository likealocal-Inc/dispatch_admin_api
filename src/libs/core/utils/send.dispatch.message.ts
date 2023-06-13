import { TelegramUtils } from 'src/config/core/telegram/telegram.utils';
import { DefaultConfig } from 'src/config/default.config';
import { TextSendUtils } from './text.send.utils';

export const SendDispatchTelegramUtils = {
  sendJin: async (message: string) => {
    await TelegramUtils.send(
      DefaultConfig.telegram.jin.botKey,
      DefaultConfig.telegram.jin.chatRoomId,
      message,
    );
  },
  // 배차요청
  dispatchRequest: async (company, orderId) => {
    SendDispatchTelegramUtils.sendJin(
      `${company}/${orderId}건이 접수 되었습니다.`,
    );
  },
  // 배차요청 정보 변경
  dispatchRequestInfoChange: async (company, orderId) => {
    SendDispatchTelegramUtils.sendJin(
      `${company}/${orderId}건이 변경 되었습니다.`,
    );
  },
  // 배차요청 취소
  dispatchRequestCancel: async (company, orderId) => {
    SendDispatchTelegramUtils.sendJin(
      `${company}/${orderId}건이 취소 되었습니다.`,
    );
  },
};

export const sendDispatchTextUtil = {
  send: async (phone, message) => TextSendUtils.send(phone, message),

  //   toCompany: {
  //     // 배차완료
  //     dispatchComplete: async (phones, company, orderId) => {
  //       TextSendUtils.send(
  //         phones,
  //         `${company}/${orderId}건이 배차가 완료되었습니다.`,
  //       );
  //     },
  //     // 배차정보 수정
  //     dispatchInfoChange: async (phones, company, orderId) => {
  //       TextSendUtils.send(
  //         phones,
  //         `${company}/${orderId}건이 배차정보가 변경되었습니다.`,
  //       );
  //     },
  //     // 배차취소
  //     dispatchInfoCancel: async (phones, company, orderId) => {
  //       TextSendUtils.send(
  //         phones,
  //         `${company}/${orderId}건이 배차가 실패되었습니다.`,
  //       );
  //     },
  //   },
  //   toCustom: {
  //     // 배차완료
  //     send: async (phones: string, message: string) => {
  //       TextSendUtils.send(phones, message);
  //     },
  //     // // 배차정보 수정
  //     // dispatchInfoChange: async (phones, company, orderId) => {
  //     //   TextSendUtils.send(
  //     //     phones,
  //     //     `${company}/${orderId}건이 배차정보가 변경되었습니다.`,
  //     //   );
  //     // },
  //     // // 배차취소
  //     // dispatchInfoCancel: async (phones, company, orderId) => {
  //     //   TextSendUtils.send(
  //     //     phones,
  //     //     `${company}/${orderId}건이 배차가 실패되었습니다.`,
  //     //   );
  //     // },
  //   },
  //   toJini: {},
};
