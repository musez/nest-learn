import {
  IsDefined,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseArticleLinkDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  readonly id: string;

  @ApiPropertyOptional({ description: '用户 id' })
  readonly userId?: string;

  @ApiPropertyOptional({ description: '文章 id' })
  readonly articleId?: string;

  @ApiProperty({ description: '状态，是否点赞（0：否；1：是；）' })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Type(() => Number)
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;
}
