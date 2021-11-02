import { PickType } from '@nestjs/swagger';
import { BaseUserAddressDto } from './base-user-address.dto';

export class CreateUserAddressDto extends PickType(BaseUserAddressDto, [
  'name',
  'mobile',
  'sex',
  'provinceId',
  'cityId',
  'districtId',
  'address',
  'status',
  'description',
  'isDefault'
]) {}
