import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BasePageDto } from '../../base.dto';

export class LimitPermissionDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '父 id' })
  readonly parentId?: string;

  @ApiPropertyOptional({
    description: '查询类型（0：子代；1：所有后代）',
    example: 0,
  })
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '查询类型必须为数字！' })
  readonly kinship?: number;

  @ApiPropertyOptional({ description: '名称' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '类型' })
  type?: number | Array<number>;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 0 })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
  readonly status?: number | string | (number | string)[];
}
