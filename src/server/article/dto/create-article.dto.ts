import { PickType } from '@nestjs/swagger';
import { BaseArticleDto } from './base-article.dto';

export class CreateArticleDto extends PickType(BaseArticleDto, [
  'cats',
  'title',
  'summary',
  'author',
  'source',
  'keywords',
  'type',
  'thumbId',
  'fileId',
  'contentUrl',
  'mediaId',
  'weight',
  'content',
  'publicTime',
  'browseCount',
  'linkCount',
  'collectCount',
  'shareCount',
  'isComment',
  'commentCount',
  'status',
  'description',
]) {}
