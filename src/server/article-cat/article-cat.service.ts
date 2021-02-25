import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';
import { Article } from '../article/entities/article.entity';
import { ArticleCat } from './entities/article-cat.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto } from '../base.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';

@Injectable()
export class ArticleCatService {
  constructor(
    @InjectRepository(ArticleCat)
    private readonly articleCatRepository: Repository<ArticleCat>,
  ) {
  }

  async insert(createArticleCatDto: CreateArticleCatDto, curUser?): Promise<CreateArticleCatDto> {
    return await this.articleCatRepository.save(createArticleCatDto);
  }

  async selectList(searchArticleCatDto: SearchArticleCatDto): Promise<ArticleCat[]> {
    let { catName } = searchArticleCatDto;

    if (Utils.isNil(catName)) {
      catName = '';
    }

    return await this.articleCatRepository.find({
      where: {
        catName: Like(`%${catName}%`),
      },
    });
  }

  async selectListPage(limitArticleCatDto: LimitArticleCatDto): Promise<any> {
    let { page, limit, catName } = limitArticleCatDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isNil(catName)) {
      catName = '';
    }

    let res = await this.articleCatRepository.createQueryBuilder()
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'ASC')
      .where('title like :catName', { title: `%${catName}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<ArticleCat> {
    let { id } = baseFindByIdDto;
    return await this.articleCatRepository.findOne(id);
  }

  async update(updateArticleCatDto: UpdateArticleCatDto, curUser?): Promise<void> {
    let { id } = updateArticleCatDto;

    let isExist = await this.articleCatRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let article = new Article();
    Utils.dto2entity(updateArticleCatDto, article);

    await this.articleCatRepository.save(article);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.articleCatRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.articleCatRepository.remove(isExist);
  }
}
