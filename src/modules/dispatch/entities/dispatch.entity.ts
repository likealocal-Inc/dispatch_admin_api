import { Dispatch } from '@prisma/client';

export class DispatchEntity implements Dispatch {
  id: string;
  created: Date;
  updated: Date;
  carCompany: string;
  jiniName: string;
  carInfo: string;
  jiniPhone: string;
  baseFare: number;
  addFare: number;
  totalFare: number;
  else01: string;
  else02: string;
  else03: string;
  userId: string;
  orderId: string;

  carType: string;
  payType: string;
  memo: string;
  exceedFare: number;
}
