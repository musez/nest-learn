import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseGroupDto {
  @ApiProperty({
    description: '主键 id',
    required: true,
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({
    description: '名称',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(50, {
    message: '名称不能大于 50 位！',
  })
  readonly name: string;

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