import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { AUTH_MUST_KEY } from '../decorators/api/auth.must/auth.must.decorator';
import { StringUtils } from 'src/libs/core/utils/string.utils';
import { ExceptionCodeList } from '../exceptions/exception.code';
import { CAuthService } from 'src/core/c.auth/c.auth.service';
import { CSessionService } from 'src/core/c.session/c.session.service';
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export class AuthMustGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: CSessionService,
    private readonly authService: CAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const mustAuthRes = this.reflector.getAllAndOverride<Role>(AUTH_MUST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // !!!!!!!!!!!중요!!!!!!!!!!!!
    // 어노테이션이 없으면 누구나 호출가능
    if (mustAuthRes === undefined) {
      return true;
    }

    const headers = context.switchToHttp().getRequest().headers;

    let sessionKey: string = headers.authorization;

    // 공백이라면 에러 처리
    if (StringUtils.isEmpty(sessionKey)) {
      // const code = ExceptionCodeList.AUTH.NO_SESSION_KEY;
      throw new CustomException(ExceptionCodeList.AUTH.NO_SESSION_KEY);
    }

    sessionKey = sessionKey.replace('Bearer ', '');

    // 쿠키에서 사용자 세션키를 조회
    // const key = CookieUtil.getSessionKey({
    //   req: context.switchToHttp().getRequest(),
    // });

    const realToken: any = await this.sessionService.getSessionBySessionKey(
      sessionKey,
    );

    // 토큰이 널이거나 공백이면 에러처리
    if (StringUtils.isEmpty(realToken)) {
      throw new CustomException(ExceptionCodeList.AUTH.NO_SESSION_KEY);
    }

    let res;

    try {
      // 토큰에서 사용자 정보를 꺼낸다.
      res = await this.authService.verifyToken(realToken);

      const userRole = res['role'];
      let roleFailMessage = '';
      const authorizationFail = 'Authorization Fail';
      // API설정이 ADMIN
      if (mustAuthRes === Role.ADMIN) {
        // 현재 사용자가 USER
        if (userRole === Role.USER) {
          roleFailMessage = authorizationFail;
        }
        // API설정이 SUPER
      } else if (mustAuthRes === Role.SUPER) {
        // 현재 사용자가 USER, ADMIN
        if (userRole === Role.USER || userRole === Role.ADMIN) {
          roleFailMessage = authorizationFail;
        }
      }

      // 권한 실패 메세지가 있으면 -> 예외처리
      if (StringUtils.isNotEmpty(roleFailMessage)) {
        throw new CustomException(ExceptionCodeList.AUTH.WRONG_ROLE);
      } else {
        context.switchToHttp().getRequest().user = await res;
      }
    } catch (error) {
      throw new CustomException(
        ExceptionCodeList.AUTH.UNAUTHORIZED,
        error.message,
      );
    }
    return true;
  }
}
