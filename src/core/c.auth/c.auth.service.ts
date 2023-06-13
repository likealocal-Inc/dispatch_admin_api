import { Injectable } from '@nestjs/common';
import { CUserService } from '../c.user/c.user.service';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CreateCUserDto } from '../c.user/dto/create.c.user.dto';
import { JwtService } from '@nestjs/jwt';
// import { JwtConfig } from 'src/config/core/authentication/jwt.config';
import { CSessionService } from '../c.session/c.session.service';
import { CAuthUtils } from './c.auth.utils';
import { EmailLoginDto } from './dto/email.login.dto';
import { Role } from '@prisma/client';
import { CUserEntity } from '../c.user/entities/c.user.entity';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { DefaultConfig } from 'src/config/default.config';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { LoginResponseDto } from './dto/login.response.dto';
import { CompanyService } from 'src/modules/company/company.service';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';

@Injectable()
export class CAuthService {
  cAuthUtils: CAuthUtils;
  constructor(
    private readonly prisma: PrismaService,
    private readonly cUserService: CUserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: CSessionService,
    private readonly companyService: CompanyService,
  ) {
    this.cAuthUtils = new CAuthUtils(this.prisma);
  }

  /**
   * 이메일 회원가입
   * @param createJoinDto
   * @returns
   */
  async joinEmail(createJoinDto: CreateCUserDto): Promise<CUserEntity> {
    createJoinDto.password = await SecurityUtils.oneWayEncryptData(
      createJoinDto.password,
    );
    return await this.cUserService.create(createJoinDto);
  }

  /**
   * 사용자 인증처리
   * @param email
   * @param pass
   * @returns
   */
  async validateUser(user: EmailLoginDto, roles: Role[]): Promise<CUserEntity> {
    const dbUser: CUserEntity = await this.cUserService.findOneByEmailAndRole(
      user,
      roles,
    );
    // DB 조회 사용자가 없으면 -> 예외
    if (dbUser == null) {
      throw new CustomException(ExceptionCodeList.USER.NOT_EXIST_EMAIL);
    }

    // 패스워드가 정확할때
    if (dbUser && dbUser.password === user.password) {
      dbUser.password = '';
      return dbUser;
    }
    // 패스워드 오류
    throw new CustomException(ExceptionCodeList.AUTH.WRONG_PASSWORD);
  }

  async makeResponseAfterSession(
    dbUser: CUserEntity,
  ): Promise<LoginResponseDto> {
    const token = await this.createToken(dbUser);
    const userSessionKey = await this.sessionService.setSession(
      dbUser.id,
      token,
    );
    const resLoginDto: LoginResponseDto = new LoginResponseDto(
      dbUser,
      userSessionKey,
    );

    return resLoginDto;
  }

  /**
   * 이메일 로그인
   * @param user
   * @param roles
   * @returns
   */
  async loginEmail(user: EmailLoginDto) {
    //const dbUser: CUserEntity = await this.validateUser(user, roles);
    const dbUser = await this.cUserService.findOneByEmail(user.email);

    if (dbUser === null || dbUser === undefined) {
      throw new CustomException(ExceptionCodeList.AUTH.UNAUTHORIZED);
    }

    if (
      (await SecurityUtils.oneWayCompareBcryptData(
        dbUser.password,
        user.password,
      )) === false
    ) {
      throw new CustomException(ExceptionCodeList.AUTH.WRONG_PASSWORD);
    }
    if (dbUser.isActive === false) {
      throw new CustomException(ExceptionCodeList.AUTH.IN_ACTIVITY);
    }

    // 회사 활성화 여부 체크
    const company = await this.companyService.findOneByName(dbUser.company);
    if (company.isActive === false) {
      throw new CustomException(ExceptionCodeList.COMPANY.INACTIVE_COMPANY);
    }
    return await this.makeResponseAfterSession(dbUser);
  }

  /**
   * 로그아웃처리
   * @param userId
   * @returns
   */
  async logout(userId: number): Promise<any> {
    return await this.sessionService.delSession(userId);
  }

  /**
   * 토큰 검증
   * @param token
   * @returns
   */
  async verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: DefaultConfig.auth.jwt.getSecretKey(), // JwtConfig.secrete,
    });
  }

  async createToken(user: CUserEntity) {
    const payload = { email: user.email, id: user.id, role: user.role };
    let token: string;
    try {
      token = await this.jwtService.signAsync(payload);
    } catch (err) {
      throw new CustomException(ExceptionCodeList.AUTH.TOKEN_FAIL);
    }
    const resToken = await this.prisma.token.findUnique({
      where: { userId: user.id },
    });
    if (!resToken) {
      await this.prisma.token.upsert({
        where: {
          userId: user.id,
        },
        create: { userId: user.id, token },
        update: { token },
      });
    } else {
      await this.prisma.token.update({
        where: { id: resToken.id },
        data: { token },
      });
    }

    return token;
  }
}
