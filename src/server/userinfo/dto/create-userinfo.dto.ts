import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseUserinfoDto } from './base-userinfo.dto';

export class CreateUserinfoDto extends PickType(BaseUserinfoDto, [
  'provinceId',
  'cityId',
  'districtId',
  'address',
  'user',
]) {}
