import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { Transform, Type } from 'class-transformer';

export class LimitFileDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '文件类型（0：本地；1：七牛）', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '文件类型必须为数字！' })
  readonly type?: number;

  @ApiPropertyOptional({ description: '文件原始名称' })
  readonly originalName?: string;

  @ApiPropertyOptional({ description: '文件显示名称' })
  readonly fileDisName?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 1 })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
  readonly status?: number | string | (number | string)[];
}
