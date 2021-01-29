import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleCatDto } from './create-article-cat.dto';

export class UpdateArticleCatDto extends PartialType(CreateArticleCatDto) {}
