import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create.company.dto';
import { UpdateCompanyDto } from './dto/update.company.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from '../../libs/core/dtos/paging';
import { CompanyEntiry } from './entities/company.entity';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const count = await this.prisma.company.count({
      where: { name: createCompanyDto.name },
    });
    if (count > 0) {
      throw new CustomException(
        ExceptionCodeList.COMPANY.ALREADY_EXIST_COMPANY,
      );
    }
    return this.prisma.company.create({ data: createCompanyDto });
  }

  async findManyPaging(pagingDto: PagingDto) {
    let count;
    let orders;
    const size = +pagingDto.size;
    const page = +pagingDto.page;
    await this.prisma.$transaction(async (tx) => {
      count = await tx.company.count();
      orders = await tx.company.findMany({
        where: { isActive: true },
        skip: page,
        take: size,
        orderBy: { name: 'asc' },
      });
    });
    return {
      count,
      page,
      size,
      data: orders,
    };
  }

  findOneById(id: string) {
    return this.prisma.company.findFirst({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prisma.company.findFirst({ where: { name } });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }

  /**
   * 활성화
   * @param id
   * @param active
   * @returns
   */
  async updateAcive(id: string, active: boolean): Promise<CompanyEntiry> {
    return await this.prisma.company.update({
      where: { id },
      data: { isActive: active },
    });
  }
}
