import { DefaultConfig } from 'src/config/default.config';

export class NewIamwebOrderModel {
  order_no: string;
  order_time: string;
  status: string;
  orderer_member_code: string;
  orderer_name: string;
  orderer_email: string;
  orderer_phone: string;
  delivery_country: string;
  delivery_country_text: string;
  payment_pay_type: string;
  payment_pg_type: string;
  payment_price_currency: string;
  payment_total_price: number;
  pay_time: string;

  info = '';

  order_title: string;
  order_infomation = '';

  boarding_date = '';
  boarding_time = '';
  start_name = '';
  start_address = '';
  goal_name = '';
  goal_address = '';
  start_airport = '';
  goal_airport = '';
  waypoint = '';

  constructor(data: any) {
    this.order_no = data.order_no;
    this.order_time = data.order_time;
    this.orderer_member_code = data.orderer.member_code;
    this.orderer_name = data.orderer.name;
    this.orderer_email = data.orderer.email;
    this.orderer_phone = data.orderer.call;
    this.delivery_country = data.delivery.country;
    this.delivery_country_text = data.delivery.country_text;
    this.payment_pay_type = data.payment.pay_type;
    this.payment_pg_type = data.payment.pg_type;
    this.payment_price_currency = data.payment.price_currency;
    this.payment_total_price = data.payment.total_price;

    const forms = data.form;

    let info = '{';
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];

      // 탑승일
      if (DefaultConfig.iamwebApi.lang.boardingDate.includes(element.title)) {
        this.boarding_date = element.value;
      }
      // 탑승일시간
      else if (
        DefaultConfig.iamwebApi.lang.boardingTime.includes(element.title)
      ) {
        this.boarding_time = element.value;
      } else {
        info += `"${element.title}":"${element.value}"`;
        if (forms.length - 1 > index) {
          info += ',';
        }
      }
    }
    info += '}';
    this.info = JSON.parse(info);
  }
}
