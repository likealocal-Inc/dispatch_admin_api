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
  isSame(otherEntity: UpdateOrderDto): boolean {
    if (this.orderTitle !== otherEntity.orderTitle) {
      return false;
    }
    if (this.boardingDate !== otherEntity.boardingDate) {
      return false;
    }
    if (this.startLocation !== otherEntity.startLocation) {
      return false;
    }
    if (this.startAddress !== otherEntity.startAddress) {
      return false;
    }
    if (this.goalLocation !== otherEntity.goalLocation) {
      return false;
    }
    if (this.goalAddress !== otherEntity.goalAddress) {
      return false;
    }
    if (this.information !== otherEntity.information) {
      return false;
    }
    if (this.else01 !== otherEntity.else01) {
      return false;
    }
    if (this.customName !== otherEntity.customName) {
      return false;
    }
    if (this.customPhone !== otherEntity.customPhone) {
      return false;
    }

    return true;
  }
}
