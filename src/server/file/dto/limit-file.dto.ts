import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength, IsOptional } from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { Transform } from 'class-transformer';

export class LimitFileDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '文件原始名称' })
  readonly originalName?: string;

  @ApiPropertyOptional({ description: '文件显示名称' })
  readonly fileDisName?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsOptional()
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;
}
