import { Injectable } from '@nestjs/common';
import { CEmailService } from 'src/core/c.email/c.email.service';

@Injectable()
export class DevService {
  constructor(private readonly cEamilService: CEmailService) {}

  async send() {
    const res = this.cEamilService.send({
      to: 'hanblues@gmail.com',
      subject: 'hello world',
      html: '<h1>hello</h1>',
    });
    console.log(res);
    return true;
  }
}
