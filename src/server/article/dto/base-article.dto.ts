import { IsNotEmpty, IsString, IsInt, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/constants';

export class BaseArticleDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '标题', example: '' })
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

  @ApiProperty({ description: '媒体类型（1：文本；2：链接；3：图片；4：组图；5：视频；6：音频）', default: 0 })
  @Transform(type => Number.parseInt(type))
  @IsInt({ message: '媒体类型为数字！' })
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
  @Transform(weight => Number.parseInt(weight))
  @IsInt({ message: '权重为数字！' })
  readonly weight?: number;

  @ApiPropertyOptional({ description: '内容', example: '' })
  readonly content?: string;

  @ApiPropertyOptional({ description: '发布时间' })
  readonly publicTime?: Date;

  @ApiPropertyOptional({ description: '浏览量', example: 0 })
  @Transform(browseCount => Number.parseInt(browseCount))
  @IsInt({ message: '浏览量为数字！' })
  readonly browseCount?: number;

  @ApiPropertyOptional({ description: '点赞量', example: 0 })
  @Transform(linkCount => Number.parseInt(linkCount))
  @IsInt({ message: '点赞量为数字！' })
  readonly linkCount?: number;

  @ApiPropertyOptional({ description: '收藏量', example: 0 })
  @Transform(collectCount => Number.parseInt(collectCount))
  @IsInt({ message: '收藏量为数字！' })
  readonly collectCount?: number;

  @ApiPropertyOptional({ description: '分享量', example: 0 })
  @Transform(shareCount => Number.parseInt(shareCount))
  @IsInt({ message: '分享量为数字！' })
  readonly shareCount?: number;

  @ApiPropertyOptional({ description: '评论量', example: 0 })
  @Transform(commentCount => Number.parseInt(commentCount))
  @IsInt({ message: '评论量为数字！' })
  readonly commentCount?: number;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: '' })
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, { message: '描述不能大于 $constraint1 位！' })
  readonly description?: string;
}
