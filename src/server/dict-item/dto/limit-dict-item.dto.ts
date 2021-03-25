import { ApiProperty, ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitDictItemDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '字典项名称' })
  readonly itemText?: string;

  @ApiPropertyOptional({ description: '字典 id' })
  readonly dictId?: string;
}
