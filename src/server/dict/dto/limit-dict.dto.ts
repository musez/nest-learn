import {
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { Transform } from 'class-transformer';

export class LimitDictDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '字典名称' })
  readonly dictName?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 1 })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
  readonly status?: number | string | (number | string)[];
}
