import { PickType } from '@nestjs/swagger';
import { BaseArticleCatDto } from './base-article-cat.dto';

export class CreateArticleCatDto extends PickType(BaseArticleCatDto, [
  'catName',
  'status',
  'description',
]) {}
