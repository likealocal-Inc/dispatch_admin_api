import { OrderStatus, Orders } from '@prisma/client';

export class OrderEntity implements Orders {
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
  company: string;
}
