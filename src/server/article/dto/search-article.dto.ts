import { PickType } from '@nestjs/swagger';
import { LimitArticleDto } from './limit-article.dto';

export class SearchArticleDto extends PickType(LimitArticleDto, [
  'title',
  'type',
  'status',
  'catId',
]) {}
