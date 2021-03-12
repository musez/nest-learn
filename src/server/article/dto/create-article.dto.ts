import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseArticleDto } from './base-article.dto';

export class CreateArticleDto extends PickType(BaseArticleDto,
  ['title', 'summary', 'author', 'source', 'keywords', 'type', 'thumbId', 'fileId', 'contentUrl', 'mediaId', 'weight', 'content', 'publicTime', 'browseCount', 'linkCount', 'collectCount', 'shareCount', 'isComment', 'commentCount', 'articleStatus', 'description'],
) {

}
