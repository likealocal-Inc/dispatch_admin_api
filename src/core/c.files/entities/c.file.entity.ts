import { ApiProperty } from '@nestjs/swagger';
import { Files } from '@prisma/client';

export class CFileEntity implements Files {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  more01: string;

  @ApiProperty()
  more02: string;

  @ApiProperty()
  created: Date;
  @ApiProperty()
  updated: Date;
}
