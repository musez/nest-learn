import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitAreaDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '父 ID' })
  readonly parentId?: string;

  @ApiPropertyOptional({ description: '地区名称' })
  readonly areaName?: string;
}
