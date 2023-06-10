import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { DefaultConfig } from 'src/config/default.config';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';

@Injectable()
export class SetService {
  constructor(private readonly prisma: PrismaService) {}
  async initService() {
    const companyCount = await this.prisma.company.count({
      where: { name: DefaultConfig.iamwebApi.iamwebOrderUserCompany },
    });
    if (companyCount === 0) {
      await this.prisma.company.create({
        data: {
          name: DefaultConfig.iamwebApi.iamwebOrderUserCompany,
          isActive: true,
        },
      });
    }

    const count = await this.prisma.user.count({
      where: { email: DefaultConfig.iamwebApi.iamwebOrderUserEmail },
    });

    if (count === 0) {
      await this.prisma.user.create({
        data: {
          company: DefaultConfig.iamwebApi.iamwebOrderUserCompany,
          email: DefaultConfig.iamwebApi.iamwebOrderUserEmail,
          name: '관리자',
          password: await SecurityUtils.oneWayEncryptData('1234'),
          phone: '01065412494',
          position: '관리자',
          isActive: true,
          role: 'SUPER',
        },
      });
    }
  }
}
