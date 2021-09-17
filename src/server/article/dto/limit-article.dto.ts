import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitArticleDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '标题' })
  readonly title?: string;

  @ApiPropertyOptional({ description: '文章类型（0：文本；1：链接；2：图片；3：组图；4：视频；5：音频）' })
  readonly type?: number;

  @ApiPropertyOptional({ description: '状态（0：未发布；1：发布；2：草稿；3：回收站）' })
  // @IsOptional()
  // @Transform(value => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
   readonly status?: string;

  @ApiPropertyOptional({ description: '栏目 id' })
  readonly catId?: string;
}
