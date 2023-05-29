import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { IamwebOrderBatch } from './iamweb.order.batch';
import { CUserModule } from 'src/core/c.user/c.user.module';

@Module({
  imports: [HttpModule, PrismaModule, CUserModule],
  controllers: [OrderController],
  providers: [OrderService, IamwebOrderBatch],
  exports: [OrderService],
})
export class OrderModule {}
