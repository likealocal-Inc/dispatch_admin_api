import { TelegramUtils } from 'src/config/core/telegram/telegram.utils';
import { DefaultConfig } from 'src/config/default.config';
import { TextSendUtils } from './text.send.utils';

export const SendDispatchTelegramUtils = {
  sendIamweb: async (message: string) => {
    await TelegramUtils.send(
      DefaultConfig.telegram.iamweb.botKey,
      DefaultConfig.telegram.iamweb.chatRoomId,
      message,
    );
  },
  newIamweb: async (message: string) => {
    await SendDispatchTelegramUtils.sendIamweb(`${message}이 접수 되었습니다.`);
  },

  sendJin: async (message: string) => {
    await TelegramUtils.send(
      DefaultConfig.telegram.jin.botKey,
      DefaultConfig.telegram.jin.chatRoomId,
      message,
    );
  },

  dispatchMessageJin: async (company, orderId, msg) => {
    await SendDispatchTelegramUtils.sendJin(`${company}/${orderId} [${msg}]`);
  },
  dispatchMessageLikealocal: async (company, orderId, msg) => {
    await SendDispatchTelegramUtils.sendIamweb(
      `${company}/${orderId} [${msg}]`,
    );
  },

  // 배차요청
  dispatchRequest: async (company, orderId) => {
    await SendDispatchTelegramUtils.dispatchMessageJin(
      company,
      orderId,
      '배차요청이 접수 되었습니다.',
    );
    // await SendDispatchTelegramUtils.sendJin(
    //   `${company}/${orderId} 배차요청이 접수 되었습니다.`,
    // );
  },
  // 배차요청 정보 변경
  dispatchRequestInfoChange: async (company, orderId) => {
    await SendDispatchTelegramUtils.dispatchMessageJin(
      company,
      orderId,
      '배차요청이 변경 되었습니다.',
    );
    // await SendDispatchTelegramUtils.sendJin(
    //   `${company}/${orderId} 배차요청이 변경 되었습니다.`,
    // );
  },
  // 배차요청 취소
  dispatchRequestCancel: async (company, orderId) => {
    await SendDispatchTelegramUtils.dispatchMessageJin(
      company,
      orderId,
      ' 배차요청이 취소 되었습니다.',
    );
    // await SendDispatchTelegramUtils.sendJin(
    //   `${company}/${orderId} 배차요청이 취소 되었습니다.`,
    // );
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
