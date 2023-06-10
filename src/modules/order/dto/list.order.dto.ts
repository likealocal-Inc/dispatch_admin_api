import { OrderStatus, Orders } from '@prisma/client';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';
import { OrderEntity } from '../entities/order.entity';

export class ListOrderDto implements Orders {
  id: string;
  created: Date;
  updated: Date;
  isIamweb: boolean;
  iamwebOrderNo: string;
  orderTime: string;
  orderTitle: string;
  boardingDate: string;
  startLocation: string;
  startAddress: string;
  goalLocation: string;
  goalAddress: string;
  startAirport: string;
  goalAirport: string;
  information: string;
  else01: string;
  else02: string;
  status: OrderStatus;
  userId: string;
  user: CUserEntity;
  company: string;

  key: number;
  customName: string;
  customPhone: string;

  constructor(orderEntidy: OrderEntity) {
    this.id = orderEntidy.id;
    this.created = orderEntidy.created;
    this.updated = orderEntidy.updated;
    this.isIamweb = orderEntidy.isIamweb;
    this.iamwebOrderNo = orderEntidy.iamwebOrderNo;
    this.orderTime = orderEntidy.orderTime;
    this.orderTitle = orderEntidy.orderTitle;
    this.boardingDate = orderEntidy.boardingDate;
    this.startLocation = orderEntidy.startLocation;
    this.startAddress = orderEntidy.startAddress;
    this.goalLocation = orderEntidy.goalLocation;
    this.goalAddress = orderEntidy.goalAddress;
    this.startAirport = orderEntidy.startAirport;
    this.goalAirport = orderEntidy.goalAirport;
    this.information = orderEntidy.information;
    this.else01 = orderEntidy.else01;
    this.else02 = orderEntidy.else02;
    this.status = orderEntidy.status;
    this.userId = orderEntidy.userId;
    this.company = orderEntidy.company;

    this.key = orderEntidy.key;
    this.customName = orderEntidy.customName;
    this.customPhone = orderEntidy.customPhone;
  }
}
