import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CUserEntity } from '../c.user/entities/c.user.entity';
import { APIResponseObj } from 'src/libs/core/utils/http.utils';
import { CAuthService } from './c.auth.service';
import { JwtService } from '@nestjs/jwt';

export class CAuthUtils {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * DB에 토큰 저장
   * @param user
   * @param token
   */
  async insertTokenInDB(user: CUserEntity, token: string) {
    // 사용자의 이전 토큰을 조회
    const resToken = await this.prisma.token.findUnique({
      where: { id: user.id },
    });

    if (!resToken) {
      await this.prisma.token.upsert({
        where: {
          userId: user.id,
        },
        create: { userId: user.id, token: token },
        update: { token: token },
      });
    } else {
      await this.prisma.token.update({
        where: { id: resToken.id },
        data: { token: token },
      });
    }
  }
}
