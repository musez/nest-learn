import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ArticleDataCatService } from './article-data-cat.service';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';

@Controller('article-data-cat')
export class ArticleDataCatController {
  constructor(private readonly articleDataCatService: ArticleDataCatService) {}

  @Post()
  create(@Body() createArticleDataCatDto: CreateArticleDataCatDto) {
    return this.articleDataCatService.create(createArticleDataCatDto);
  }

  @Get()
  findAll() {
    return this.articleDataCatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleDataCatService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDataCatDto: UpdateArticleDataCatDto) {
    return this.articleDataCatService.update(+id, updateArticleDataCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleDataCatService.remove(+id);
  }
}
