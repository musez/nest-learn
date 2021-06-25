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

    return await this.articleRepository.createQueryBuilder()
      .where(queryCondition, {
        title: `%${title}%`,
        type: type,
        status: status,
      })
      .orderBy('createTime', 'DESC')
      .getMany();
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

    const res = await this.articleRepository.createQueryBuilder()
      .where(queryCondition, {
        title: `%${title}%`,
        type: type,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'DESC')
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
    const { id } = baseFindByIdDto;
    return await this.articleRepository.findOne(id);
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
  async update(updateArticleDto: UpdateArticleDto, curUser?): Promise<void> {
    const { id } = updateArticleDto;

    let article = new Article();
    article = Utils.dto2entity(updateArticleDto, article);

    await this.articleRepository.update(id, article);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    // await this.articleRepository.createQueryBuilder()
    //   .delete()
    //   .from(Article)
    //   .where('id = :id', { id: id })
    //   .execute();
    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser&&curUser.id })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 回收站状态修改
   */
  async updateRecycle(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<void> {
    const { ids, status } = baseModifyStatusByIdsDto;

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ status: status, updateBy: curUser&&curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 清空回收站
   */
  async clearRecycle(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    const { ids } = baseFindByIdsDto;

    // await this.articleRepository.createQueryBuilder()
    //   .delete()
    //   .from(Article)
    //   .where('id in (:ids)', { ids: ids })
    //   .execute();

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser&&curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
