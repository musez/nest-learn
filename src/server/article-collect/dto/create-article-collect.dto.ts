import { PickType } from '@nestjs/swagger';
import { BaseArticleCollectDto } from './base-article-collect.dto';

export class CreateArticleCollectDto extends PickType(BaseArticleCollectDto, [
  'userId',
  'articleId',
  'status',
]) {
}
