import { HttpStatus } from '@nestjs/common';

export class ExceptionCode {
  constructor(
    private readonly code: string,
    private readonly message: string,
    private readonly status: number,
  ) {}
  getCode = () => this.code;
  getMessage = () => this.message;
  getStatus = () => this.status;
}

export const ExceptionCodeList = {
  ERROR: new ExceptionCode('ERROR', 'ERROR', HttpStatus.INTERNAL_SERVER_ERROR),
  AUTH: {
    UNAUTHORIZED: new ExceptionCode(
      'UNAUTHORIZED',
      '인증오류',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_PASSWORD: new ExceptionCode(
      'WRONG_PASSWORD',
      '패스워드 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    IN_ACTIVITY: new ExceptionCode(
      'IN_ACTIVITY',
      '비활성화 상태',
      HttpStatus.UNAUTHORIZED,
    ),
    NO_SESSION_KEY: new ExceptionCode(
      'NO_SESSION_KEY',
      '세션키가 없음',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_SESSION_KEY: new ExceptionCode(
      'WRONG_SESSION_KEY',
      '세션키가 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_ROLE: new ExceptionCode(
      'WRONG_ROLE',
      '권한 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    TOKEN_FAIL: new ExceptionCode(
      'TOKEN_FAIL',
      '토큰 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_REQUEST_AUTH: new ExceptionCode(
      'WRONG_REQUEST_AUTH',
      '비정상적인 호출',
      HttpStatus.UNAUTHORIZED,
    ),
  },
  USER: {
    NOT_EXIST_EMAIL: new ExceptionCode(
      'NOT_EXIST_EMAIL',
      '이메일 존재',
      HttpStatus.BAD_REQUEST,
    ),
    ALREADY_EXIST_USER: new ExceptionCode(
      'ALREADY_EXIST_USER',
      '이메일 사용자 이미 존재',
      HttpStatus.BAD_REQUEST,
    ),
    ALREADY_EXIST_COMPANY: new ExceptionCode(
      'ALREADY_EXIST_COMPANY',
      '이미 회사명 존재',
      HttpStatus.BAD_REQUEST,
    ),
  },
  COMMON: {
    WRONG_REQUEST: new ExceptionCode(
      'WRONG_REQUEST',
      '요청 오류',
      HttpStatus.BAD_REQUEST,
    ),
    EMAIL_SEND_ERROR: new ExceptionCode(
      'EMAIL_SEND_ERROR',
      '이메일 전송오류',
      HttpStatus.BAD_REQUEST,
    ),
  },
  FILE: {
    FILE_NOT_FOUND: new ExceptionCode(
      'FILE_NOT_FOUND',
      '파일 없음',
      HttpStatus.BAD_REQUEST,
    ),
  },
  IAMWEB: {
    TOKEN_CANOT_GET: new ExceptionCode(
      'TOKEN_CANOT_GET',
      '토큰을 가져오는데 문제발생',
      HttpStatus.BAD_REQUEST,
    ),
  },
  COMPANY: {
    ALREADY_EXIST_COMPANY: new ExceptionCode(
      'ALREADY_EXIST_COMPANY',
      '이미 회사명 존재',
      HttpStatus.BAD_REQUEST,
    ),
    INACTIVE_COMPANY: new ExceptionCode(
      'INACTIVE_COMPANY',
      '현재 회사는 비활성화 상태',
      HttpStatus.BAD_REQUEST,
    ),
  },
};
