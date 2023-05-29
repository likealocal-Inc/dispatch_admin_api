import { PartialType } from '@nestjs/swagger';
import { CreateCFileDto } from './create-c.file.dto';

export class UpdateCFileDto extends PartialType(CreateCFileDto) {}
