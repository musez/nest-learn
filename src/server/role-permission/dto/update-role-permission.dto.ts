import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './create-role-permission.dto';

export class UpdateRolePermissionDto extends PartialType(CreateRolePermissionDto) {
  @ApiProperty({ description: '主键 id' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
