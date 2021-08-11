import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Article } from './entities/article.entity';
import { SearchArticleDto } from './dto/search-article.dto';
import { LimitArticleDto } from './dto/limit-article.dto';
import { ArticleDataCat } from '../article-data-cat/entities/article-data-cat.entity';
import { ArticleCat } from '../article-cat/entities/article-cat.entity';
import { ArticleCatService } from '../article-cat/article-cat.service';
import { ArticleDataCatService } from '../article-data-cat/article-data-cat.service';
import { ApiException } from '../../common/exception/api-exception';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly articleCatService: ArticleCatService,
    private readonly articleDataCatService: ArticleDataCatService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleDto: CreateArticleDto, curUser): Promise<any> {
    const { cats } = createArticleDto;

    let article = new Article();
    article = Utils.dto2entity(createArticleDto, article);

    const ret = await this.articleRepository.save(article);
    if (!ret) {
      throw new ApiException('操作异常！', 500);
    }
    return await this.bindArticleCats(ret.id, cats);
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleDto: SearchArticleDto): Promise<any[]> {
    const { title, type, status } = searchArticleDto;

    const queryConditionList = [];
    if (!Utils.isBlank(title)) {
      queryConditionList.push('title LIKE :title');
    }
    if (!Utils.isBlank(type)) {
      queryConditionList.push('type = :type');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.articleRepository.createQueryBuilder()
      .where(queryCondition, {
        title: `%${title}%`,
        type: type,
        status: status,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();

    for (let item of ret) {
      const { id } = item;

      const retRel = await this.articleRepository.createQueryBuilder('article')
        .innerJoinAndSelect(ArticleDataCat, 'adc', 'article.id = adc.articleId')
        .innerJoinAndSelect(ArticleCat, 'ac', 'ac.id = adc.catId')
        .select('ac.id', 'ac.catName')
        .where('article.id = :id', {
          id: id,
        })
        .getMany();

      item = Object.assign(item, {
        cats: retRel,
      });
    }

    return ret;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleDto: LimitArticleDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, title, type, status } = limitArticleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(title)) {
      queryConditionList.push('article.title LIKE :title');
    }
    if (!Utils.isBlank(type)) {
      queryConditionList.push('article.type = :type');
    }
    if (!Utils.isBlank(status)) {
      // @ts-ignore
      status = status.split(',');
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('article.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.articleRepository.createQueryBuilder('article')
      .innerJoinAndSelect('article.articleDataCats', 'articleDataCats')
      .where(queryCondition, {
        title: `%${title}%`,
        type: type,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'article.createTime': 'DESC' })
      .getManyAndCount();

    for (let item of ret[0]) {
      const { articleDataCats } = item;
      if (articleDataCats?.length > 0) {
        const ids = articleDataCats.map(v => v.id);
        const retRel = await this.articleDataCatService.selectByArticleDataCatIds({
          ids: ids.join(','),
        });

        item = Object.assign(item, {
          articleDataCats: retRel.map(v => v.cat),
        });
      }
    }

    return {
      list: ret[0],
      total: ret[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    const { id } = baseFindByIdDto;
    const ret = await this.articleRepository.findOne(id, {
      relations: ['articleDataCats'],
    });
    if (!ret) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }
    if (ret?.articleDataCats) {
      const ids = ret.articleDataCats.map(v => v.id);

      const articleDataCatRet = await this.articleDataCatService.selectByArticleDataCatIds({
        ids: ids.join(','),
      });

      // @ts-ignore
      ret.articleDataCats = articleDataCatRet.map(v => {
        return v.cat;
      });
    }

    return ret;
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.articleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateArticleDto: UpdateArticleDto, curUser): Promise<void> {
    const { id, cats } = updateArticleDto;

    let article = new Article();
    article = Utils.dto2entity(updateArticleDto, article);

    const ret = await this.articleRepository.update(id, article);
    if (!ret) {
      throw new ApiException('操作异常！', 500);
    }

    return await this.bindArticleCats(id, cats);
  }

  /**
   * 回收站状态修改
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser): Promise<void> {
    const { ids, status } = baseModifyStatusByIdsDto;

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ status: status, updateBy: curUser!.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 回收站删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 回收站清空
   */
  async deleteAll(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 绑定栏目
   */
  async bindArticleCats(id: string, cats: string): Promise<void> {
    const articleCats = cats.split(',');

    const articleRet = await this.articleRepository.findOne({
      where: {
        id: id,
      },
    });

    const articleDataCats = [];
    for (const item of articleCats) {
      const articleCatRet = await this.articleCatService.selectById({ id: item });
      const articleDataCat = new ArticleDataCat();
      articleDataCat.article = articleRet;
      articleDataCat.cat = articleCatRet;

      articleDataCats.push(articleDataCat);
    }

    const deleteRet = await this.articleDataCatService.deleteByArticleId(id);
    if (!deleteRet) {
      throw new ApiException('操作异常！', 500);
    }

    const ret = await this.articleDataCatService.insertBatch(articleDataCats);

    if (ret) {
      return null;
    } else {
      throw new ApiException('操作异常！', 500);
    }
  }
}
