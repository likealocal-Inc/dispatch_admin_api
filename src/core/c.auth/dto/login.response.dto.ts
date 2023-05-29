import { ApiProperty } from '@nestjs/swagger';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';

// 로그인 반환값
export class LoginResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  sessionKey: string;

  constructor(dbUser: CUserEntity, sessionKey: string) {
    this.userId = dbUser.id;
    this.email = dbUser.email;
    this.sessionKey = sessionKey;
  }
}
