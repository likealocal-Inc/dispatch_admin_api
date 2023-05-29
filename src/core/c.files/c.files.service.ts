import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { CreateCFileDto } from './dto/create-c.file.dto';
import { UpdateCFileDto } from './dto/update-c.file.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CFileEntity } from './entities/c.file.entity';

/**
 * 파일 처리
 */
@Injectable()
export class CFilesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 파일 업로드 정보 DB에 저장
   * @param createCFileDto
   * @returns
   */
  async create(createCFileDto: CreateCFileDto): Promise<CFileEntity> {
    return await this.prisma.files.create({ data: createCFileDto });
  }

  /**
   * 파일 정보 조회
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<CFileEntity> {
    return await this.prisma.files.findUnique({ where: { id } });
  }

  /**
   * 파일 정보 업데이트
   * @param id
   * @param updateCFileDto
   * @returns
   */
  async update(
    id: string,
    updateCFileDto: UpdateCFileDto,
  ): Promise<CFileEntity> {
    return await this.prisma.files.update({
      where: { id },
      data: updateCFileDto,
    });
  }

  /**
   *물리 파일 삭제 및 데이터 삭제
   * @param id
   * @param isDelDisk 디스크에 파일 삭제 여부
   * @returns
   */
  async remove(id: string, isDelDisk = true): Promise<CFileEntity> {
    const file = await this.findOne(id);
    // 파일 삭제
    if (isDelDisk) await fs.unlink(file.path, (err) => err);

    return await this.prisma.files.delete({ where: { id } });
  }
}
