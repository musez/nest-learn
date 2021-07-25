import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../user/dto/base-user.dto';

export class CreateUserAddressDto extends PickType(BaseUserDto,
  ['name', 'mobile', 'sex', 'provinceId', 'cityId', 'districtId', 'address', 'status', 'description']) {
}
