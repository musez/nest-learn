import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateRolePermissionDto {
  @ApiProperty({ description: '角色 id'})
  @IsNotEmpty({ message: '角色 id 不能为空' })
  roleId: string;

  @ApiProperty({ description: '角色 id'})
  @IsNotEmpty({ message: '权限 id 不能为空' })
  permissionId: string;
}
