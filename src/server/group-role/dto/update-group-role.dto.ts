import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGroupRoleDto } from './create-group-role.dto';

export class UpdateGroupRoleDto extends PartialType(CreateGroupRoleDto) {
  @ApiProperty({ description: '主键 id' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
