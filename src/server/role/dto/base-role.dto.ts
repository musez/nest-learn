import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseRoleDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '名称', example: '' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(50, { message: '名称不能大于 50 位！' })
  readonly name: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: '' })
  readonly description: string;
}
