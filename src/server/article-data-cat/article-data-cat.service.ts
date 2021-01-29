import { Injectable } from '@nestjs/common';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';

@Injectable()
export class ArticleDataCatService {
  create(createArticleDataCatDto: CreateArticleDataCatDto) {
    return 'This action adds a new articleDataCat';
  }

  findAll() {
    return `This action returns all articleDataCat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleDataCat`;
  }

  update(id: number, updateArticleDataCatDto: UpdateArticleDataCatDto) {
    return `This action updates a #${id} articleDataCat`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleDataCat`;
  }
}
