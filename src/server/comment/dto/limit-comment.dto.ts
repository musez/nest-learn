import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LimitCommentDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '评论 id' })
  readonly commentId?: string;

  @ApiPropertyOptional({ description: '评论内容' })
  readonly content?: string;

  @ApiPropertyOptional({ description: '主题类型' })
  readonly replyType?: number;

  @ApiPropertyOptional({ description: '状态，多个使用逗号“,”分隔（0：禁用；1：启用）', example: 1 })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
   readonly status?: string;
}
