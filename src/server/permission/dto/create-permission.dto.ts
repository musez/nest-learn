import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: '名称',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '名称不能为空！' })
  readonly name: string;

  @ApiProperty({
    description: '父 id',
    required: false,
    default: null,
  })
  readonly parentId: string;

  @ApiProperty({
    description: '状态（0：禁用；1：启用）',
    required: false,
    default: 0,
  })
  readonly status: number;

  @ApiProperty({
    description: '描述',
    required: false,
    default: '',
  })
  readonly description: string;
}
