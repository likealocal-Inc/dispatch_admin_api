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

  // 시간대절
  start_goal = '';
  trip_route = '';
  timezon = '';

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
      let isInfoJson = false;

      // 탑승일
      if (
        DefaultConfig.iamwebApi.lang.options.boardingDate.includes(
          element.title,
        )
      ) {
        this.boarding_date = element.value;
      }
      // 탑승일시간
      else if (
        DefaultConfig.iamwebApi.lang.options.boardingTime.includes(
          element.title,
        )
      ) {
        this.boarding_time = element.value;
      } else {
        // SNS 채널
        if (
          DefaultConfig.iamwebApi.lang.options.snsChannel.includes(
            element.title,
          )
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.snsChannel[0]}":"${element.value}"`;
          isInfoJson = true;
        }
        // SNS 아이디
        else if (
          DefaultConfig.iamwebApi.lang.options.snsId.includes(element.title)
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.snsId[0]}":"${element.value}"`;
          isInfoJson = true;
        }
        // 승객수
        else if (
          DefaultConfig.iamwebApi.lang.options.passengers.includes(
            element.title,
          )
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.passengers[0]}":"${element.value}"`;
          isInfoJson = true;
        }
        // 비행편
        else if (
          DefaultConfig.iamwebApi.lang.options.flight.includes(element.title)
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.flight[0]}":"${element.value}"`;
          isInfoJson = true;
        }
        // 이착륙시간
        else if (
          DefaultConfig.iamwebApi.lang.options.lading.includes(element.title)
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.lading[0]}":"${element.value}"`;
          isInfoJson = true;
        }
        // 기타
        else if (
          DefaultConfig.iamwebApi.lang.options.other.includes(element.title)
        ) {
          info += `"${DefaultConfig.iamwebApi.lang.options.other[0]}":"${element.value}"`;
          isInfoJson = true;
        } else {
          info += `"${element.title}":"${element.value}"`;
          isInfoJson = true;
        }
      }
      if (forms.length - 1 > index && isInfoJson === true) {
        info += ',';
        isInfoJson = false;
      }
    }
    info += '}';
    console.log(info);
    this.info = JSON.parse(info);
  }
}
