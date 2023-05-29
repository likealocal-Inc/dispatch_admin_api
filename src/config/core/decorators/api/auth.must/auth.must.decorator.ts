import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * 사용자 인증 필수
 */
export const AUTH_MUST_KEY = 'AUTH_MUST_KEY';
export const AUTH_MUST = (role: Role = Role.USER) =>
  SetMetadata(AUTH_MUST_KEY, role);
