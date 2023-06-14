import { join } from 'path';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { CFilesModule } from './core/c.files/c.files.module';
import { PrismaModule } from './config/core/prisma/prisma.module';
import { LoggingInterceptor } from './config/core/interceptor/logger.interceptor';
import { CAuthModule } from './core/c.auth/c.auth.module';
import { CSessionModule } from './core/c.session/c.session.module';
import { LoggerMiddleware } from './config/core/middleware/http.logger.middleware';
import { AuthMustGuard } from './config/core/guard/auth.must.guard';
import { CAuthService } from './core/c.auth/c.auth.service';
import { CUserModule } from './core/c.user/c.user.module';
import { HttpExceptionFilter } from './config/core/filters/http.exception.filter';
import { CacheModule } from './config/core/cache/cache.config';
import { CEmailModule } from './core/c.email/c.email.module';

import { DevModule } from './sample/dev/dev.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CScheduleModule } from './core/c.schedule/c.schedule.module';
import { HttpModule } from '@nestjs/axios';
import { CTelegramModule } from './core/c.telegram/c.telegram.module';
import { CompanyModule } from './modules/company/company.module';
import { OrderModule } from './modules/order/order.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { SetModule } from './modules/set/set.module';
import { LogModule } from './modules/log/log.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/docs*'],
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    JwtModule,
    // CacheModule.register({ isGlobal: true }),
    CacheModule,
    HttpModule,

    /////////////////// CORE ///////////////////
    CFilesModule,
    CAuthModule,
    CSessionModule,
    CUserModule,
    CEmailModule,
    CScheduleModule,
    CTelegramModule,
    /////////////////// Service ///////////////////
    DevModule,

    CompanyModule,

    OrderModule,

    DispatchModule,

    SetModule,

    LogModule,
  ],
  controllers: [],
  providers: [
    CAuthService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_GUARD, useClass: AuthMustGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
