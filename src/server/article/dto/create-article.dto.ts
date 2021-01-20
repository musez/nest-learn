import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseArticleDto } from './base-article.dto';

export class CreateArticleDto extends PickType(BaseArticleDto,
  ['title', 'summary', 'author', 'source', 'keywords', 'type', 'thumbUrl', 'contentUrl', 'mediaUrl', 'weight', 'content', 'publicTime', 'browseCount', 'linkCount', 'collectCount', 'shareCount', 'commentCount', 'status', 'description'],
) {

}
