import { PickType } from '@nestjs/swagger';
import { BaseUserAddressDto } from './base-user-address.dto';

export class CreateUserAddressDto extends PickType(BaseUserAddressDto,
  ['userId', 'name', 'mobile', 'sex', 'provinceId', 'cityId', 'districtId', 'address', 'status', 'description']) {
}
