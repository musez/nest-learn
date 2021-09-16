import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleConstants, BaseConstants } from '../../../constants/swagger.const';

export class BaseArticleDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '栏目 ids', example: null })
  @IsOptional()
  readonly cats?: string;

  @ApiProperty({ description: '标题', example: null })
  @IsDefined({ message: '标题不能为空！' })
  @IsNotEmpty({ message: '标题不能为空！' })
  @MaxLength(ArticleConstants.TITLE_MAX_LENGTH, {
    message: '标题不能大于 $constraint1 位！',
  })
  readonly title: string;

  @ApiPropertyOptional({ description: '摘要', example: null })
  @IsOptional()
  @MaxLength(ArticleConstants.SUMMARY_MAX_LENGTH, {
    message: '摘要不能大于 $constraint1 位！',
  })
  readonly summary?: string;

  @ApiPropertyOptional({ description: '作者', example: null })
  @IsOptional()
  @MaxLength(ArticleConstants.AUTHOR_MAX_LENGTH, {
    message: '作者不能大于 $constraint1 位！',
  })
  readonly author?: string;

  @ApiPropertyOptional({ description: '来源', example: null })
  @IsOptional()
  @MaxLength(ArticleConstants.SOURCE_MAX_LENGTH, {
    message: '来源不能大于 $constraint1 位！',
  })
  readonly source?: string;

  @ApiPropertyOptional({
    description: '关键字（多个使用逗号“，”分隔）',
    example: null,
  })
  @IsOptional()
  @MaxLength(ArticleConstants.KEYWORDS_MAX_LENGTH, {
    message: '关键字不能大于 $constraint1 位！',
  })
  readonly keywords?: string;

  @ApiProperty({
    description:
      '文章类型（0：文本；1：链接；2：图片；3：组图；4：视频；5：音频）',
    default: 0,
  })
  @IsDefined({ message: '文章类型不能为空！' })
  @IsNotEmpty({ message: '文章类型不能为空！' })
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '文章类型为数字！' })
  readonly type: number;

  @ApiPropertyOptional({ description: '缩略图', example: null })
  @IsOptional()
  // @MaxLength(255, { message: '缩略图不能大于 255 位！' })
  readonly thumbId?: string;

  @ApiPropertyOptional({ description: '附件', example: null })
  @IsOptional()
  // @MaxLength(255, { message: '附件不能大于 255 位！' })
  readonly fileId?: string;

  @ApiPropertyOptional({ description: '链接地址' })
  @IsOptional()
  // @MaxLength(255, { message: '链接地址不能大于 255 位！' })
  readonly contentUrl?: string;

  @ApiPropertyOptional({ description: '媒体地址', example: null })
  @IsOptional()
  // @MaxLength(255, { message: '媒体地址不能大于 255 位！' })
  readonly mediaId?: string;

  @ApiPropertyOptional({ description: '权重', default: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '权重为数字！' })
  readonly weight?: number;

  @ApiPropertyOptional({ description: '内容', example: null })
  readonly content?: string;

  @ApiPropertyOptional({ description: '发布时间' })
  readonly publicTime?: Date;

  @ApiPropertyOptional({ description: '浏览量', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '浏览量为数字！' })
  readonly browseCount?: number;

  @ApiPropertyOptional({ description: '点赞量', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '点赞量为数字！' })
  readonly linkCount?: number;

  @ApiPropertyOptional({ description: '收藏量', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '收藏量为数字！' })
  readonly collectCount?: number;

  @ApiPropertyOptional({ description: '分享量', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '分享量为数字！' })
  readonly shareCount?: number;

  @ApiPropertyOptional({ description: '允许评论', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '评论量为数字！' })
  readonly isComment?: number;

  @ApiPropertyOptional({ description: '评论量', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '允许评论为数字！' })
  readonly commentCount?: number;

  @ApiProperty({
    description: '状态（0：未发布；1：发布；2：草稿；3：回收站）',
    example: 2,
  })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, {
    message: '描述不能大于 $constraint1 位！',
  })
  readonly description?: string;
}
