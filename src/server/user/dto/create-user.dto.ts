import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends PickType(BaseUserDto,
  ['userName', 'userType', 'name', 'mobile', 'email', 'sex', 'birthday', 'provinceId', 'cityId', 'districtId', 'address', 'status', 'description']) {
}
