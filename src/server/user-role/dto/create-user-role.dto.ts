import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateUserRoleDto {
  @ApiProperty({ description: '用户 id'})
  @IsNotEmpty({ message: '用户 id 不能为空' })
  userId: string;

  @ApiProperty({ description: '角色 id'})
  @IsNotEmpty({ message: '角色 id 不能为空' })
  roleId: string;
}
