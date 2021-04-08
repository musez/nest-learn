import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitFileDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '文件原始名称' })
  readonly originalName?: string;

  @ApiPropertyOptional({ description: '文件显示名称' })
  readonly fileDisName?: string;
}
