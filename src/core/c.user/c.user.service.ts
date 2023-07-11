import { Injectable } from '@nestjs/common';
import { CreateCUserDto } from './dto/create.c.user.dto';
import { UpdateCUserDto } from './dto/update.c.user.dto';
import { CUserEntity } from './entities/c.user.entity';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { EmailLoginDto } from '../c.auth/dto/email.login.dto';
import { Role } from '@prisma/client';
import { FindUserDto } from './dto/find.user.dto';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';

interface FindResposeDto<T> {
  count: number;
  size: number;
  page: number;
  data: T;
}

@Injectable()
export class CUserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 생성
   * @param createCUserDto
   * @returns
   */
  async create(createCUserDto: CreateCUserDto): Promise<CUserEntity> {
    // 사용자 존재 하는지 이메일로 확인
    const count: number = await this.countUserByEmail(createCUserDto.email);

    if (count > 0) {
      throw new CustomException(ExceptionCodeList.USER.ALREADY_EXIST_USER);
    } else {
      return await this.prisma.user.create({
        data: createCUserDto,
      });
    }
  }

  async findAllPaging(
    findUserDto: FindUserDto,
    userId = '-1',
  ): Promise<FindResposeDto<CUserEntity[]>> {
    let count;
    const size = +findUserDto.size;
    const page = +findUserDto.page * +findUserDto.size;
    let users;
    await this.prisma.$transaction(async (tx) => {
      const user = await this.findId(userId);
      let where = {};
      if (user.role === Role.ADMIN) {
        where = { role: Role.USER };
      }
      count = await tx.user.count();
      users = await tx.user.findMany({
        where,
        skip: page,
        take: size,
        orderBy: {
          created: 'desc',
        },
      });
    });
    return {
      count,
      page,
      size,
      data: users,
    };
  }

  // 아이디로 조회
  async findId(id: string): Promise<CUserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    user.password = '';
    return user;
  }

  // 화사이름으로 조회
  async findCompany(company: string): Promise<CUserEntity> {
    return await this.prisma.user.findFirst({ where: { company } });
  }

  async update(
    id: string,
    updateCUserDto: UpdateCUserDto,
  ): Promise<CUserEntity> {
    // const user = await this.findCompany(updateCUserDto.company);

    // 회사이름으로 조회한 사용자 아이디가 현재 아이디와 다르다면 이미 존재하는 회사명
    // if (user !== null) {
    //   if (user.id !== id) {
    //     throw new CustomException(ExceptionCodeList.USER.ALREADY_EXIST_COMPANY);
    //   }
    // }

    // 패스워드값이 안넘어 왔으면 업데이트 안함
    if (
      updateCUserDto.password === undefined ||
      updateCUserDto.password === null ||
      updateCUserDto.password.trim() === ''
    ) {
      return await this.prisma.user.update({
        where: { id },
        data: {
          phone: updateCUserDto.phone,
          position: updateCUserDto.position,
          name: updateCUserDto.name,
          company: updateCUserDto.company,
        },
      });
    } else {
      updateCUserDto.password = await SecurityUtils.oneWayEncryptData(
        updateCUserDto.password,
      );
      return await this.prisma.user.update({
        where: { id },
        data: {
          password: updateCUserDto.password,
          phone: updateCUserDto.phone,
          position: updateCUserDto.position,
          name: updateCUserDto.name,
          company: updateCUserDto.company,
        },
      });
    }
  }

  async updateAcive(id: string, active: boolean): Promise<CUserEntity> {
    return await this.prisma.user.update({
      where: { id },
      data: { isActive: active },
    });
  }

  async remove(id: string): Promise<CUserEntity> {
    return await this.prisma.user.delete({ where: { id } });
  }

  /**
   * 이메일 사용자 조회 -> 권한 확인
   * @param emailLoginDto
   * @param roles
   * @returns
   */
  async findOneByEmailAndRole(
    emailLoginDto: EmailLoginDto,
    roles: Role[] = [Role.USER],
  ): Promise<CUserEntity | undefined> {
    try {
      const dbUser: CUserEntity = await this.prisma.user.findUnique({
        where: { email: emailLoginDto.email },
      });

      if (dbUser === null) {
        // 권한 오류
        throw new CustomException(ExceptionCodeList.AUTH.WRONG_ROLE);
      } else {
        for (let index = 0; index < roles.length; index++) {
          if (dbUser.role === roles[index]) {
            return dbUser;
          }
        }
      }
    } catch {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST);
    }
  }

  /**
   * 이메일로 조회
   * @param emailLoginDto
   * @returns
   */
  async findOneByEmail(email: string): Promise<CUserEntity> {
    const dbUser: CUserEntity = await this.prisma.user.findUnique({
      where: { email },
    });

    return dbUser;
  }

  /**
   * 이메일로 사용자 갯수 조회
   * @param email
   * @returns
   */
  async countUserByEmail(email: string): Promise<number> {
    const count: number = await this.prisma.user.count({
      where: { email },
    });
    return count;
  }
}
