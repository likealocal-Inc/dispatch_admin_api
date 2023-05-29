import { Module } from '@nestjs/common';
import { CAuthService } from './c.auth.service';
import { CAuthController } from './c.auth.controller';
import { CUserModule } from '../c.user/c.user.module';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CSessionModule } from '../c.session/c.session.module';
import { DefaultConfig } from 'src/config/default.config';
// import { JwtConfig } from 'src/config/core/authentication/jwt.config';

@Module({
  imports: [
    CSessionModule,
    PrismaModule,
    CUserModule,
    JwtModule.register({
      global: true,
      secret: DefaultConfig.auth.jwt.getSecretKey(), // JwtConfig.secrete,
      signOptions: { expiresIn: DefaultConfig.auth.jwt.getExpireTime() }, // JwtConfig.expiredTime },
    }),
  ],
  controllers: [CAuthController],
  providers: [CAuthService],
})
export class CAuthModule {}
