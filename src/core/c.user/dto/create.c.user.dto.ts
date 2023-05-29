import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  position: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  company: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  profileImgId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role?: Role;
}
