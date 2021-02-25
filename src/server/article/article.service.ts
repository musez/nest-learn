import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { BaseFindByIdDto } from '../base.dto';
import { Article } from './entities/article.entity';
import { SearchArticleDto } from './dto/search-article.dto';
import { LimitArticleDto } from './dto/limit-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
  }

  async insert(curUser, createArticleDto: CreateArticleDto): Promise<CreateArticleDto> {
    return await this.articleRepository.save(createArticleDto);
  }

  async selectList(searchArticleDto: SearchArticleDto): Promise<Article[]> {
    let { title } = searchArticleDto;

    if (Utils.isNil(title)) {
      title = '';
    }

    return await this.articleRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async selectListPage(limitArticleDto: LimitArticleDto): Promise<any> {
    let { page, limit, title } = limitArticleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isNil(title)) {
      title = '';
    }

    let res = await this.articleRepository.createQueryBuilder()
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'ASC')
      .where('title like :title', { title: `%${title}%` })
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

  async update(updateArticleDto: UpdateArticleDto, curUser?): Promise<void> {
    let { id } = updateArticleDto;

    let isExist = await this.articleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let article = new Article();
    Utils.dto2entity(updateArticleDto, article);

    await this.articleRepository.save(article);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.articleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.articleRepository.remove(isExist);
  }
}
