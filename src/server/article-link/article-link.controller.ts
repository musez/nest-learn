import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ArticleLinkService } from './article-link.service';
import { CreateArticleLinkDto } from './dto/create-article-link.dto';
import { UpdateArticleLinkDto } from './dto/update-article-link.dto';

@Controller('article-link')
export class ArticleLinkController {
  constructor(private readonly articleLinkService: ArticleLinkService) {}

}
