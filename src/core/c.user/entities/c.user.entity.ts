import { Gender, Role, User } from '@prisma/client';

export class CUserEntity implements User {
  id: string;
  created: Date;
  updated: Date;
  name: string;
  position: string;
  phone: string;
  email: string;
  password: string;
  gender: Gender;
  isActive: boolean;
  profileImgId: string;
  role: Role;
  company: string;
}
