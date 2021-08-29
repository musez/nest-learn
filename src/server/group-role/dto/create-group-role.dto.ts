import {
  IsDefined,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupRoleDto {
  @ApiProperty({ description: '用户组 id' })
  @IsDefined({ message: '用户组 id 不能为空！' })
  @IsNotEmpty({ message: '用户组 id 不能为空！' })
  @IsUUID('all')
  groupId: string;

  @ApiProperty({ description: '角色 id' })
  @IsDefined({ message: '角色 id 不能为空！' })
  @IsNotEmpty({ message: '角色 id 不能为空' })
  @IsUUID('all')
  roleId: string;
}
