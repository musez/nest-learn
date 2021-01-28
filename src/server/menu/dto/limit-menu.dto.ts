import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitMenuDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '父 id' })
  readonly parentId?: string;

  @ApiPropertyOptional({ description: '名称' })
  readonly name?: string;
}
