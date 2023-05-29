import { PartialType } from '@nestjs/swagger';
import { CreateDevDto } from './create-dev.dto';

export class UpdateDevDto extends PartialType(CreateDevDto) {}
