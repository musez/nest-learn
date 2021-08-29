import { PickType } from '@nestjs/swagger';
import { LimitArticleCatDto } from './limit-article-cat.dto';

export class SearchArticleCatDto extends PickType(LimitArticleCatDto, [
  'parentId',
  'kinship',
  'catName',
  'status',
]) {}
