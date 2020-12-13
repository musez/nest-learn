import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: '主键 id',
    required: true,
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
