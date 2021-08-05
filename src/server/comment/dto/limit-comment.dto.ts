import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';
import { IsDefined, IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LimitCommentDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '评论内容' })
  readonly content?: string;

  @ApiPropertyOptional({ description: '主题类型' })
  readonly replyType?: number;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(value => Number.parseInt(value))
  readonly status?: number;
}