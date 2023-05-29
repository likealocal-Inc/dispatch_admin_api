import { Controller } from '@nestjs/common';
import { CSessionService } from './c.session.service';

@Controller('c.session')
export class CSessionController {
  constructor(private readonly cSessionService: CSessionService) {}
}
