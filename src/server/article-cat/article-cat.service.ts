import { Injectable } from '@nestjs/common';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';

@Injectable()
export class ArticleCatService {
  create(createArticleCatDto: CreateArticleCatDto) {
    return 'This action adds a new articleCat';
  }

  findAll() {
    return `This action returns all articleCat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleCat`;
  }

  update(id: number, updateArticleCatDto: UpdateArticleCatDto) {
    return `This action updates a #${id} articleCat`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleCat`;
  }
}
