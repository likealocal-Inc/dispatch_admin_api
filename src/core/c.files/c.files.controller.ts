import {
  Controller,
  Get,
  Post,
  Param,
  Response,
  UseInterceptors,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  ParseIntPipe,
  StreamableFile,
  HttpException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CFilesService } from './c.files.service';
import { CreateCFileDto } from './dto/create-c.file.dto';
import { uploadImage } from 'src/config/core/fileupload/fileupload.config';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { DefaultConfig } from 'src/config/default.config';
import { CFileEntity } from './entities/c.file.entity';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';

@ApiTags('Files 처리')
@Controller('c.files')
export class CFilesController {
  constructor(private readonly cFilesService: CFilesService) {}

  /**
   * 파일 업로드
   * @param file
   * @returns
   */
  @Post('upload')
  @ApiCreatedResponse({ type: CFileEntity, isArray: false })
  @UseInterceptors(FileInterceptor('file', uploadImage)) // 업로드 설정
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(gif|png|jpg|jpeg)$/, // 업로드 가능한 확장자
        })
        .addMaxSizeValidator({
          maxSize: DefaultConfig.files.upload.image.maxSize,
        }) // 업로드 파일 사이즈
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cFilesService.create(new CreateCFileDto().convert(file)),
    );
  }

  /**
   * 파일 다운로드
   * @param id 파일 아이디
   * @param res
   * @returns
   */
  @Get('download/:id')
  async download(
    @Param('id') id: string,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    // 파일 아이디 확인
    const fileInfo: CFileEntity = await this.cFilesService.findOne(id);
    if (!fileInfo) {
      throw new CustomException(ExceptionCodeList.FILE.FILE_NOT_FOUND);
    }
    const file = createReadStream(fileInfo.path);
    const fileName = encodeURIComponent(fileInfo.originalname);
    res.set({
      'Content-Disposition': `attachment; filename=${fileName}`,
    });
    return new StreamableFile(file);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cFilesService.findOne(+id);
  // }
  @AUTH_MUST()
  @Delete(':id')
  @ApiCreatedResponse({ type: CFileEntity, isArray: false })
  remove(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(true, this.cFilesService.remove(id));
  }
}
