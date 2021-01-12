import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as _ from 'lodash';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { BaseFindByIdDto } from '../base.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
  }

  async insert(createArticleDto: CreateArticleDto): Promise<CreateArticleDto> {
    return await this.articleRepository.save(createArticleDto);
  }

  async selectList(query): Promise<Article[]> {
    let { title } = query;

    if (!title) {
      title = '';
    }

    return await this.articleRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async selectListPage(page, limit, query): Promise<any> {
    let { title } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (!title) {
      title = '';
    }

    let res = await this.articleRepository.createQueryBuilder('article')
      .skip(offset)
      .take(limit)
      .orderBy('article.createTime', 'ASC')
      .where('article.title like :title', { title: `%${title}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    let { id } = baseFindByIdDto;
    return await this.articleRepository.findOne(id);
  }

  async update(updateArticleDto: UpdateArticleDto): Promise<void> {
    let { id } = updateArticleDto;

    let isExist = await this.articleRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let article = new Article();

    for (let cityKey in updateArticleDto) {
      if (!_.isEmpty(updateArticleDto[cityKey])) {
        article[cityKey] = updateArticleDto[cityKey];
      }
    }

    await this.articleRepository.save(article);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.articleRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.articleRepository.remove(isExist);
  }
}
