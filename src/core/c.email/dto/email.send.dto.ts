import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailSendDto {
  /**
   * 받는 사람 메일
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  to: string;

  /**
   * 메일 제목
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  /**
   * 메일 내용 HTML
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  html: string;
}
