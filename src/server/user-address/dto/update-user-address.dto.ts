import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { CreateUserAddressDto } from './create-user-address.dto';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
