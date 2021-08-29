import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends PickType(BaseUserDto, [
  'userName',
  'userPwd',
  'userType',
  'name',
  'mobile',
  'email',
  'sex',
  'birthday',
  'provinceId',
  'cityId',
  'districtId',
  'address',
  'status',
  'description',
]) {}
