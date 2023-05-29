import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
export class CreateCFileDto {
  @ApiProperty()
  @IsString()
  originalname: string;

  @ApiProperty()
  @IsString()
  encoding: string;

  @ApiProperty()
  @IsString()
  mimetype: string;

  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsInt()
  size: number;

  @ApiProperty()
  @IsString()
  more01: string;

  @ApiProperty()
  @IsString()
  more02: string;

  // File 객체를 DB에 넣기 위한 변형
  convert(fileInfo: Express.Multer.File) {
    this.originalname = fileInfo.originalname;
    this.encoding = fileInfo.encoding;
    this.mimetype = fileInfo.mimetype;
    this.destination = fileInfo.destination;
    this.filename = fileInfo.filename;
    this.path = fileInfo.path;
    this.size = fileInfo.size;
    this.more01 = '';
    this.more02 = '';

    return this;
  }
}
