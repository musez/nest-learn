import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ArticleCollectService } from './article-collect.service';
import { CreateArticleCollectDto } from './dto/create-article-collect.dto';
import { UpdateArticleCollectDto } from './dto/update-article-collect.dto';

@Controller('article-collect')
export class ArticleCollectController {
  constructor(private readonly userArticleCollectService: ArticleCollectService) {}


}
