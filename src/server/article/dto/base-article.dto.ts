import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseArticleDto {
  @ApiProperty({ description: '主键 id', required: true })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '标题', required: true, example: '' })
  @IsNotEmpty({ message: '标题不能为空！' })
  @MaxLength(255, { message: '标题不能大于 255 位！' })
  readonly title: string;

  @ApiPropertyOptional({ description: '摘要', example: '' })
  @MaxLength(255, { message: '摘要不能大于 255 位！' })
  readonly summary?: string;

  @ApiPropertyOptional({ description: '作者', example: '' })
  @MaxLength(50, { message: '作者不能大于 50 位！' })
  readonly author?: string;

  @ApiPropertyOptional({ description: '来源', example: '' })
  @MaxLength(50, { message: '来源不能大于 50 位！' })
  readonly source?: string;

  @ApiPropertyOptional({ description: '关键字（多个使用逗号“，”分隔）', example: '' })
  @MaxLength(100, { message: '关键字不能大于 100 位！' })
  readonly keywords?: string;

  @ApiProperty({ description: '媒体类型（1：文本；2：链接；3：图片；4：组图；5：视频；6：音频）', required: false, default: 0 })
  readonly type: number;

  @ApiPropertyOptional({ description: '缩略图', example: '' })
  @MaxLength(255, { message: '缩略图不能大于 255 位！' })
  readonly thumbUrl?: string;

  @ApiPropertyOptional({ description: '链接地址' })
  @MaxLength(255, { message: '链接地址不能大于 255 位！' })
  readonly contentUrl?: string;

  @ApiPropertyOptional({ description: '媒体地址', example: '' })
  @MaxLength(255, { message: '媒体地址不能大于 255 位！' })
  readonly mediaUrl?: string;

  @ApiPropertyOptional({ description: '权重', default: 0 })
  readonly weight: number;

  @ApiPropertyOptional({ description: '内容', example: '' })
  readonly content: string;

  @ApiPropertyOptional({ description: '发布时间' })
  readonly publicTime: Date;

  @ApiPropertyOptional({ description: '浏览量', default: 0 })
  readonly browseCount: number;

  @ApiPropertyOptional({ description: '点赞量', default: 0 })
  readonly linkCount: number;

  @ApiPropertyOptional({ description: '收藏量', default: 0 })
  readonly collectCount: number;

  @ApiPropertyOptional({ description: '分享量', default: 0 })
  readonly shareCount: number;

  @ApiPropertyOptional({ description: '评论量', default: 0 })
  readonly commentCount: number;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', required: false, default: 0 })
  readonly status: number;

  @ApiProperty({ description: '描述', required: false, default: '' })
  readonly description: string;
}
