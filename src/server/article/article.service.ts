import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
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

    if (Utils.isEmpty(title)) {
      title = '';
    }

    return await this.articleRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async selectListPage(query): Promise<any> {
    let { page, limit, title } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isEmpty(title)) {
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
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let article = new Article();
    Utils.dto2entity(updateArticleDto, article);

    await this.articleRepository.save(article);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.articleRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.articleRepository.remove(isExist);
  }
}
