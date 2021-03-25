import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitArticleDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '标题' })
  readonly title?: string;

  @ApiPropertyOptional({ description: '文章类型（1：文本；2：链接；3：组图；4：视频；5：音频）' })
  readonly type?: number;

  @ApiPropertyOptional({ description: '状态（0：未发布；1：发布；2：草稿；3：回收站）' })
  readonly status?: number;
}
