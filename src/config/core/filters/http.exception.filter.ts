import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { LogFiles } from '../files/log.files';
import { CustomException } from '../exceptions/custom.exception';
import { ExceptionCodeList } from '../exceptions/exception.code';

/**
 * 에러처리 필터
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    let res: any;
    let errData: any;
    if (exception instanceof CustomException) {
      status = exception.getStatus();
      res = exception.getResponse();

      errData = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: res.code ? res.code : res,
        description: res.message ? res.message : res,
      };
    } else {
      status = ExceptionCodeList.ERROR.getStatus();
      errData = {
        statusCode: status, //exception['status'],
        timestamp: new Date().toISOString(),
        path: request.url,
        code: ExceptionCodeList.ERROR.getCode(),
        description: exception.message,
      };
    }

    // 반환 데이터 생성
    const data = HttpUtils.makeAPIResponse(false, errData);

    // 로그파일 작성
    const logFile = new LogFiles();
    const dir = await logFile.getDateFolderError();
    const fileName = await logFile.getDateFileNameForError();
    new LogFiles().save(dir, fileName, JSON.stringify(errData));

    // response
    response.status(status).json(data);
  }
}
