import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DictItem } from '../../dict-item/entities/dict-item.entity';

export class BaseDictDto {
  @ApiProperty({
    description: '主键 id',
    required: true,
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({
    description: '字典名称',
    example: null,
  })
  readonly dictCode: string;

  @ApiProperty({
    description: '字典编码',
    example: null,
  })
  readonly dictName: string;

  @ApiPropertyOptional({
    description: '字典类型（0：string；1：number；）',
    default: 0,
  })
  readonly type?: number;

  @ApiProperty({
    description: '字典类型',
    example: null,
  })
  readonly dictItems?: DictItem[];

  @IsInt({ message: '状态必须为数字！' })
  @ApiPropertyOptional({
    description: '状态（0：禁用；1：启用）',
    default: 0,
  })
  readonly status?: number;

  @ApiPropertyOptional({
    description: '描述',
    example: null,
  })
  readonly description?: string;

  @ApiProperty({
    description: '创建时间',
    required: false,
  })
  readonly createTime: Date;

  @ApiProperty({
    description: '修改时间',
    required: false,
  })
  readonly updateTime: Date;
}
