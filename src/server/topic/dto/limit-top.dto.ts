import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class LimitTopicDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '主题 id' })
  readonly topicId?: string;

  @ApiPropertyOptional({ description: '评论内容' })
  readonly content?: string;

  @ApiPropertyOptional({ description: '主题类型' })
  readonly topicType?: number;

  @ApiPropertyOptional({ description: '状态，多个使用逗号“,”分隔（0：禁用；1：启用）', example: 1 })
   readonly status?: string;

  @ApiPropertyOptional({ description: '回复类型（0：未回复；1：已回复）', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '回复类型必须为数字！' })
  readonly isReply?: number;
}
