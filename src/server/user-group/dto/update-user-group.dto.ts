import {
  IsDefined,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserGroupDto } from './create-user-group.dto';

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
