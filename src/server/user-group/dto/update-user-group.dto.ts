import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserGroupDto } from './create-user-group.dto';

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {
  @ApiProperty({ description: '主键 id' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
