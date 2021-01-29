import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDataCatDto } from './create-article-data-cat.dto';

export class UpdateArticleDataCatDto extends PartialType(CreateArticleDataCatDto) {}
