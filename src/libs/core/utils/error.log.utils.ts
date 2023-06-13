import { LogFiles } from 'src/config/core/files/log.files';

/**
 * 에러 로그처리
 */
export class ErrorLogUtils {
  // 로그파일 쓰기
  async write(data: any) {
    const logFile = new LogFiles();
    logFile.save(
      await logFile.getDateFolderError(),
      await logFile.getDateFileNameForError(),
      data,
    );
  }
}
