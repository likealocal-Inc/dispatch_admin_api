import { Company } from '@prisma/client';

export class CompanyEntiry implements Company {
  id: string;
  created: Date;
  updated: Date;
  name: string;
  isActive: boolean;
}
