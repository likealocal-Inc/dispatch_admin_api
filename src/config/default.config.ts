import { ConfigModule } from '@nestjs/config';
import { DateUtils } from 'src/libs/core/utils/date.utils';
import { StringUtils } from 'src/libs/core/utils/string.utils';

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
          return `${
            DefaultConfig.files.log.error.name
          }_${StringUtils.getRandomString(5)}_${name}.${
            DefaultConfig.files.log.error.ext
          }`;
        },
      },
      update: {
        path: './files/update',
        name: 'UPDATE',
        ext: 'update',
        getLogFileName: async (name: string): Promise<string> => {
          return `${
            DefaultConfig.files.log.update.name
          }_${StringUtils.getRandomString(5)}_${name}.${
            DefaultConfig.files.log.update.ext
          }`;
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
    orderSearchDays: 1, // 주문 데이터 조회 날 기준 0:당일
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
      boardingDate: ['탑승 일자', '乗車日', '乘车日期', '乘車日期'],
      boardingTime: ['탑승 시간', '乗車時間', '乘车时间', '乘車時間'],
      goalName: [
        '도착지 위치명',
        '目的地の場所名',
        '目的地地点',
        '目的地地點',
        'where are you going',
      ],
      goalAddress: [
        '도착지 위치명',
        '目的地の住所',
        '目的地地址',
        '目的地地址',
        'Please enter the exact address.(Destination)',
      ],
      startName: [
        '출발지 위치명',
        '出発地の場所名',
        '出发地地点',
        '出發地地點',
        'where are you Departures',
      ],
      startAddress: [
        '출발지 주소',
        '出発地の住所',
        '出发地地址',
        '出發地地址',
        'Please enter the exact address.(Departures)',
      ],
      startAirport: [
        '출발공항',
        '出発空港',
        '选择机场',
        '選擇機場',
        'Please select Airport.(Departure)',
      ],
      goalAirport: [
        '도착공항',
        '到着空港',
        '选择机场',
        '選擇機場',
        'Please select Airport.(Destination)',
      ],
      waypoint: ['경유지'],
      startGoal: [
        '출발지/도착지',
        '出发地/目的地',
        '出発地/到着地',
        '出発地/目的地',
        'Departure/Destination',
      ],
      tripRoute: [
        '여행 루트 (경유지/도착지를 모두 적어주세요.)',
        '旅行路线(请填写所有中转地及目的地)',
        '旅行路線（請填寫所有經由地/到達地。）',
        '旅行コース(経由地･到着地を全て入力してください。)',
        'Trip route (Please write down all the courses you travel.)',
      ],
      timezon: ['대절 시간', '包车时间', '包車時間', '貸し切る時間', 'TIMEZON'],
      options: {
        snsChannel: [
          'SNS 채널',
          '社交平台',
          'Message Channel',
          'メッセージアプリ',
          'Message Channel',
        ],
        snsId: [
          'SNS ID',
          '社交账号 (kakao/LINE/whatsapp/wechat)',
          'Channel ID (kakao/LINE/whatsapp/wechat)',
          'メッセージアプリ ID (KakaoTalk / LINE / WhatsApp / WeChat)',
          'Channel ID (kakao/LINE/Whatsapp/Wechat)',
        ],
        passengers: [
          '탑승 인원',
          '乘车人数',
          '乘車人數',
          '乗車人数',
          'The Number of passengers',
        ],
        boardingDate: [
          '탑승 일자',
          '乘车日期',
          '乘車日期',
          '乗車日',
          'Date (Boarding date)',
        ],
        boardingTime: [
          '탑승 시간',
          '乘车时间',
          '乘車時間',
          '乗車時間',
          'Time (Boarding Time)',
        ],
        flight: ['비행편', '航班信息', '航班號', '飛行便', 'Flight number'],
        lading: [
          '이륙 및 착륙 시간',
          '飞机抵达时间',
          '着陸時間',
          '離陸または着陸時間',
          'Landing time',
        ],
        other: ['기타', '其他', '其他', 'その他', 'Other'],
      },
    },

    iamwebOrderUserEmail: 'kanghao0124@mhqglobal.com',
    iamwebOrderUserCompany: 'likealocal',
  },
  telegram: {
    jin: {
      botKey: process.env.TELEGRAM_JIN_KEY, //'6131032930:AAEjQc4k6krqLlLCcDqmqaJmt_tbky9XY8E',
      chatRoomId: +process.env.TELEGRAM_JIN_CHAT_ID, //-716448733,
    },
    iamweb: {
      botKey: process.env.TELEGRAM_IAMWEB_KEY, //'6018333651:AAHcYRghyBYDo9BpY9Wd5xvrHXguwHxcbI4',
      chatRoomId: +process.env.TELEGRAM_IAMWEB_CHAT_ID, //-1001911929668,
    },
  },
  textMessage: {
    getUrl: (receiver: string, msg: string) => {
      const url = `https://apis.aligo.in/send/?key=72bsh9eyy1mtat2askdj30czfgjw2jnl&user_id=jinmobility&sender=16887722&receiver=${receiver}&msg=${encodeURIComponent(
        msg,
      )}`;
      return url;
    },
  },
};
