import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateRolePermissionDto {
  @ApiProperty({ description: '角色 id' })
  @IsDefined({ message: '角色 id 不能为空！' })
  @IsNotEmpty({ message: '角色 id 不能为空！' })
  @IsUUID('all')
  roleId: string;

  @ApiProperty({ description: '权限 id' })
  @IsDefined({ message: '权限 id 不能为空！' })
  @IsNotEmpty({ message: '权限 id 不能为空！' })
  @IsUUID('all')
  permissionId: string;
}
