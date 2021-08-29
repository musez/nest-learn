import { PickType } from '@nestjs/swagger';
import { LimitUserAddressDto } from './limit-user-address.dto';

export class SearchUserAddressDto extends PickType(LimitUserAddressDto, [
  'name',
  'mobile',
  'status',
]) {}
