import { ApiProperty, ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitDictDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '字典名称' })
  readonly dictName?: string;
}
