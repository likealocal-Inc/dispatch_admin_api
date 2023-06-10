export class CreateOrderDto {
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

  // 2023.06.09 추가 (탑승자, 탑승자 번호)
  customName: string;
  customPhone: string;
}
