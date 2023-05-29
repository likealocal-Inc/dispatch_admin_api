import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRedisDto {
  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @ApiProperty()
  value: string | Map<string, string>;
}
