import { DateUtils } from 'src/libs/core/utils/date.utils';

/**
 * 시스테 기본 설정 값
 */
export const DefaultConfig = {
  // 스웨거 설정
  swagger: {
    title: '',
    description: '',
    version: '',
    tag: '',
  },
  // 기호
  sign: {
    arrToStringDelim: '|', // 스트링과 배열을 나누는 값
  },
  // 파일 관련설정
  files: {
    upload: {
      image: {
        path: `./files/`, // 파일 업로드 로뜨 폴드
        maxSize: 100000000, // 파일 업로드 최대 사이즈
        // 파일 저장 경로 가져오기(년/월/일)
        getUploadFilePath: (): string => {
          return `${DefaultConfig.files.upload.image.path}${DateUtils.nowString(
            'YYYY/MM/DD',
          )}`;
        },
      },
    },
    log: {
      error: {
        path: './files/error',
        name: 'ERROR',
        ext: 'err',
        getLogFileName: async (name: string): Promise<string> => {
          return `${DefaultConfig.files.log.error.name}_${name}.${DefaultConfig.files.log.error.ext}`;
        },
      },
    },
  },
  // 인증관련
  auth: {
    jwt: {
      getSecretKey: () => 'likealocal!!!jwtKey',
      getExpireTime: () => '1h',
    },
  },
  session: {
    getKey: () => 'likelocal_session_key_!!!',
  },
  security: {
    getKey: () => 'likealocalkeysecury',
  },
  redis: {
    // 레디스 접속 주소
    getURL: () => `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
  },
  email: {
    getInfo: () => {
      return {
        service: process.env.MAIL_SERVICE,
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      };
    },
  },
  schedule: {
    jobName: { job1: 'sampleJob1', job2: 'sampleJob2' },
  },
  iamwebApi: {
    iamwebProductID: {
      privateTaxi: 133,
      pickup: 83,
      sanding: 122,
    },
    orderSearchDays: 30, // 주문 데이터 조회 날 기준 0:당일
    responseCodeList: [
      { CODE: -1, DESC: '잘못된 API 키 또는 시크릿' },
      { CODE: -2, DESC: '잘못된 액세스 토큰으로 접근' },
      { CODE: -5, DESC: '권한 오류' },
      {
        CODE: -6,
        DESC: '이용 버전 권한 오류 ( 보통 버전별 제한에 걸릴 때 발생)',
      },
      { CODE: -7, DESC: '요청횟수 초과' },
      {
        CODE: -10,
        DESC: '잘못된 파라미터 또는 호출 인자가 잘못되었거나 필수 인자가 포함되지 않은 경우',
      },
      { CODE: -11, DESC: '요청 데이터가 존재하지 않는 경우' },
      { CODE: -19, DESC: '내부 처리 오류' },
      { CODE: -98, DESC: '존재하지 않는 서비스로 요청' },
      { CODE: -99, DESC: '존재하지 않는 메소드로 요청' },
      { CODE: -999, DESC: '서비스 점검중' },
      { CODE: 200, DESC: 'Success' },
    ],
    checkNeedNewToken: async (code: string): Promise<boolean> => {
      for (
        let index = 0;
        index < DefaultConfig.iamwebApi.responseCodeList.length;
        index++
      ) {
        if (
          DefaultConfig.iamwebApi.responseCodeList[0].CODE.toString() ===
            code ||
          DefaultConfig.iamwebApi.responseCodeList[1].CODE.toString() === code
        ) {
          return true;
        }
      }
      return false;
    },
    responseCodeCheck: async (code: number): Promise<string> => {
      for (
        let index = 0;
        index < DefaultConfig.iamwebApi.responseCodeList.length;
        index++
      ) {
        const temp = DefaultConfig.iamwebApi.responseCodeList[index];
        if (temp.CODE === code) {
          return temp.DESC;
        }
      }
    },
    //언어별 단어
    lang: {
      boardingDate: ['乗車日', '탑승 일자', '乘车日期', '乘車日期'],
      boardingTime: ['乗車時間', '탑승 시간', '乘车时间', '乘車時間'],
      goal_name: ['도착지 위치명', '目的地の場所名'],
      goal_address: ['도착지 위치명', '目的地の住所'],
      start_name: ['출발지 위치명', '出発地の場所名'],
      start_address: ['출발지 주소', '出発地の住所'],
      start_airport: ['출발공항', '出発空港'],
      goal_airport: ['도착공항', '到着空港'],
      waypoint: ['경유지'],
    },

    iamwebOrderUserId: '1',
  },
  telegram: {
    botKey: '6018333651:AAHcYRghyBYDo9BpY9Wd5xvrHXguwHxcbI4',
    chatRoomId: 847828318,
  },
};
