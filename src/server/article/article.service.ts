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
import { File } from '../file/entities/file.entity';

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
    let { title, type, status } = searchArticleDto;

    let queryConditionList = [];

    if (!Utils.isBlank(title)) {
      queryConditionList.push('title LIKE :title');
    }

    if (!Utils.isBlank(type)) {
      queryConditionList.push('type = :type');
    }

    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }

    let queryCondition = queryConditionList.join(' AND ');

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
    let { page, limit, title, type, status } = limitArticleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    if (!Utils.isBlank(title)) {
      queryConditionList.push('title LIKE :title');
    }

    if (!Utils.isBlank(type)) {
      queryConditionList.push('type = :type');
    }

    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.articleRepository.createQueryBuilder()
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
    let { id } = baseFindByIdDto;
    return await this.articleRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.articleRepository.findOne(id);
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
    let { id } = updateArticleDto;

    let article = new Article();
    article = Utils.dto2entity(updateArticleDto, article);

    await this.articleRepository.update(id, article);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    // await this.articleRepository.delete(isExist);
    await this.articleRepository.createQueryBuilder()
      .delete()
      .from(Article)
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 回收站状态修改
   */
  async updateRecycle(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<void> {
    let { ids, status } = baseModifyStatusByIdsDto;

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ status: status, updateBy: curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 清空回收站
   */
  async clearRecycle(baseFindByIdsDto: BaseFindByIdsDto): Promise<void> {
    let { ids } = baseFindByIdsDto;

    await this.articleRepository.createQueryBuilder()
      .delete()
      .from(Article)
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
