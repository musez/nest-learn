import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDictDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '字典名称', example: '' })
  @IsNotEmpty({ message: '字典名称不能为空' })
  readonly dictCode: string;

  @ApiProperty({ description: '字典编码', example: '' })
  @IsNotEmpty({ message: '字典编码不能为空' })
  readonly dictName: string;

  @ApiPropertyOptional({ description: '字典类型（0：string；1：number；）', example: 0 })
  @Transform(type => Number.parseInt(type))
  @IsInt({ message: '字典类型为数字！' })
  readonly type?: number;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: '' })
  readonly description?: string;
}
