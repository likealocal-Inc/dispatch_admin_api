import { PartialType } from '@nestjs/swagger';
import { CreateCSessionDto } from './create-c.session.dto';

export class UpdateCSessionDto extends PartialType(CreateCSessionDto) {}
