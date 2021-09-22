import { PickType } from '@nestjs/swagger';
import { BaseArticleLinkDto } from './base-article-link.dto';

export class CreateArticleLinkDto extends PickType(BaseArticleLinkDto, [
  'userId',
  'articleId',
  'status',
]) {
}
