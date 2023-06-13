import { OrderEntity } from '../entities/order.entity';

export class UpdateOrderDto {
  orderTime: string;
  orderTitle: string;
  boardingDate: string;
  startLocation: string;
  startAddress: string;
  goalLocation: string;
  goalAddress: string;
  information: string;
  else01: string;
  else02: string;
  customName: string;
  customPhone: string;

  convertFromEntity(entity: OrderEntity): UpdateOrderDto {
    this.orderTitle = entity.orderTitle;
    this.boardingDate = entity.boardingDate;
    this.startLocation = entity.startLocation;
    this.startAddress = entity.startAddress;
    this.goalLocation = entity.goalLocation;
    this.goalAddress = entity.goalAddress;
    this.information = entity.information;
    this.else01 = entity.else01;
    this.else02 = entity.else02;
    this.customName = entity.customName;
    this.customPhone = entity.customPhone;

    return this;
  }
}
