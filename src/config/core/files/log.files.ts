import { DefaultConfig } from 'src/config/default.config';
import { Files } from './files';
import { DateUtils } from 'src/libs/core/utils/date.utils';
import { CustomException } from '../exceptions/custom.exception';
import { ExceptionCodeList } from '../exceptions/exception.code';

export enum EnumUpdateLogType {
  ORDER = 'ORDER',
  DISPATCH = 'DISPATCH',
  STATUS = 'STATUS',
}
/**
 * 로그파일처리 유틸
 */

export class LogFiles {
  // 로그파일 저장 경로
  file: Files;

  constructor() {
    this.file = new Files();
  }

  // 로그파일 저장용 날짜폴더
  async getDateFolderError() {
    return `${DefaultConfig.files.log.error.path}/${DateUtils.nowString(
      'YYYY/MM/DD',
    )}`;
  }

  async getDateFolderUpdate() {
    return `${DefaultConfig.files.log.update.path}/${DateUtils.nowString(
      'YYYY/MM/DD',
    )}`;
  }

  /**
   * 에러로그남기기
   * @param data
   */
  async error(data: string) {
    this.save(
      await this.getDateFolderError(),
      await this.getDateFileNameForError(),
      data,
    );
  }

  /**
   * 업데이트 로그
   * @param data
   */
  async update(
    before: string,
    after: string,
    type: EnumUpdateLogType,
    orderId: string,
    userEmail: string,
  ) {
    const data = { type: type, id: orderId, userEmail: userEmail };
    data['before'] = before;
    data['after'] = after;

    await this.save(
      await this.getDateFolderUpdate(),
      await this.getDateFileNameForUpdate(),
      JSON.stringify(data),
    );
  }

  async getUpdateFiles({ year, month, day }: any): Promise<string[]> {
    const dir = `${DefaultConfig.files.log.update.path}/${year}/${month}/${day}`;
    const files = await this.file.getFiles(dir);
    return files;
  }

  async readUpdateFile(path: string) {
    return await this.file.read(path);
  }

  async getDateFileNameForUpdate() {
    const name = DateUtils.nowString('YYYYMMDD');
    const fileName: string =
      await DefaultConfig.files.log.update.getLogFileName(name);

    return fileName;
  }

  async getDateFileNameForError() {
    const name = DateUtils.nowString('YYYYMMDD');
    const fileName: string = await DefaultConfig.files.log.error.getLogFileName(
      name,
    );

    return fileName;
  }

  /**
   * 로그파일 저장
   * @param data
   * @param fileName
   */
  async save(dir: string, fileName: string, data: string) {
    // 에러파일명(연월일)
    // const name = DateUtils.nowString('YYYYMMDD');
    // const fileName: string = await DefaultConfig.files.log.error.getLogFileName(
    //   name,
    // );

    //연월일 폴더
    // const newPath = await this.getDateFolder();
    console.log(data);
    try {
      const jsonData = JSON.parse(data);
      //에러 메세지에 일시 추가
      const date = DateUtils.nowString('YYYY/MM/DD hh:mm:ss');

      const res = {};
      res['date'] = date;
      res['data'] = jsonData;

      await this.file.write(dir, fileName, JSON.stringify(res) + ',\n');
    } catch (err) {}
  }

  /**
   * 해당 경로페 파일 리스트가져오기
   * @param path
   * @returns
   */
  async getLogFileListErr() {
    return await this.file.getFiles(DefaultConfig.files.log.error.path);
  }
}
