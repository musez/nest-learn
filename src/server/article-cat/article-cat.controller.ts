import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ArticleCatService } from './article-cat.service';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';

@Controller('article-cat')
export class ArticleCatController {
  constructor(private readonly articleCatService: ArticleCatService) {}

  @Post()
  create(@Body() createArticleCatDto: CreateArticleCatDto) {
    return this.articleCatService.create(createArticleCatDto);
  }

  @Get()
  findAll() {
    return this.articleCatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleCatService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleCatDto: UpdateArticleCatDto) {
    return this.articleCatService.update(+id, updateArticleCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleCatService.remove(+id);
  }
}
