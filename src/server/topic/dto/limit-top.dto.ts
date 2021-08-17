import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LimitTopicDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '主题 id' })
  readonly topicId?: string;

  @ApiPropertyOptional({ description: '评论内容' })
  readonly content?: string;

  @ApiPropertyOptional({ description: '主题类型' })
  readonly topicType?: number;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;
}
