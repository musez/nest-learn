import {
  Controller,
} from '@nestjs/common';
import { ArticleDataCatService } from './article-data-cat.service';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';

@Controller('article-data-cat')
export class ArticleDataCatController {
  constructor(private readonly articleDataCatService: ArticleDataCatService) {}
}
