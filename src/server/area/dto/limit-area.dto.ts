import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitAreaDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({
    description: '地区名称',
  })
  readonly areaName: string;
}
