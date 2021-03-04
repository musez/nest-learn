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

  /**
   * 添加
   */
  async insert(createArticleDto: CreateArticleDto, curUser?): Promise<CreateArticleDto> {
    return await this.articleRepository.save(createArticleDto);
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleDto: SearchArticleDto): Promise<Article[]> {
    let { title } = searchArticleDto;

    let queryConditionList = [];

    if (!Utils.isBlank(title)) {
      queryConditionList.push('title LIKE :title');
    }

    let queryCondition = queryConditionList.join(' AND ');

    return await this.articleRepository.createQueryBuilder()
      .where(queryCondition, {
        title: `%${title}%`,
      })
      .orderBy('createTime', 'ASC')
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleDto: LimitArticleDto): Promise<any> {
    let { page, limit, title } = limitArticleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    if (!Utils.isBlank(title)) {
      queryConditionList.push('title LIKE :title');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.articleRepository.createQueryBuilder()
      .where(queryCondition, {
        title: `%${title}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'ASC')
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    let { id } = baseFindByIdDto;
    return await this.articleRepository.findOne(id);
  }

  /**
   * 修改
   */
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

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.articleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    // await this.articleRepository.delete(isExist);
    await this.articleRepository.createQueryBuilder()
      .delete()
      .from(Article)
      .where('id = :id', { id: id })
      .execute();
  }
}
