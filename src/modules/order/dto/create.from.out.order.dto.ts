import { CreateOrderDto } from './create.order.dto';

export class CreateFromOutOrderDto implements CreateOrderDto {
  orderTitle: string;
  boardingDate: string;
  startLocation: string;
  startAddress: string;
  goalLocation: string;
  goalAddress: string;
  information: string;
  company: string;
  else01: string;
  else02: string;
  customName: string;
  customPhone: string;

  outName: string;

  getCreateOrderDto() {
    const res: CreateOrderDto = new CreateOrderDto();
    res.orderTitle = this.orderTitle;
    res.boardingDate = this.boardingDate;
    res.startLocation = this.startLocation;
    res.startAddress = this.startAddress;
    res.goalLocation = this.goalLocation;
    res.goalAddress = this.goalAddress;
    res.information = this.information;
    res.company = this.company;
    res.else01 = this.else01;
    res.else02 = this.else02;
    res.customName = this.customName;
    res.customPhone = this.customPhone;
    return res;
  }
}
