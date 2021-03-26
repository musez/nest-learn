import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';
import { Article } from '../article/entities/article.entity';
import { ArticleCat } from './entities/article-cat.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class ArticleCatService {
  constructor(
    @InjectRepository(ArticleCat)
    private readonly articleCatRepository: Repository<ArticleCat>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleCatDto: CreateArticleCatDto, curUser?): Promise<CreateArticleCatDto> {
    let articleCat = new ArticleCat();
    articleCat = Utils.dto2entity(createArticleCatDto, articleCat);
    articleCat.createBy = curUser.id;
    return await this.articleCatRepository.save(createArticleCatDto);
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleCatDto: SearchArticleCatDto): Promise<ArticleCat[]> {
    let { parentId, kinship, catName } = searchArticleCatDto;

    let queryConditionList = [];

    let parentIds = null;
    if (!Utils.isBlank(parentId)) {
      if (kinship === 0) {
        parentIds = parentId;
        queryConditionList.push('parentId = :parentIds');
      } else {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        queryConditionList.push('parentId IN (:...parentIds)');
      }
    } else {
      queryConditionList.push('parentId IS NULL');
    }

    if (!Utils.isBlank(catName)) {
      queryConditionList.push('catName LIKE :catName');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.articleCatRepository.createQueryBuilder('ac')
      .select(['ac.*'])
      .addSelect(subQuery =>
        subQuery.select('COUNT(*)')
          .from(ArticleCat, 'subAC')
          .where('subAC.parentId = ac.id'), 'hasChildren')
      .orderBy('createTime', 'DESC')
      .where(queryCondition, {
        parentIds: parentIds,
        catName: `%${catName}%`,
      })
      .getRawMany();
    return res;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleCatDto: LimitArticleCatDto): Promise<any> {
    let { page, limit, parentId, catName } = limitArticleCatDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:...parentIds)');
    }

    if (!Utils.isBlank(catName)) {
      queryConditionList.push('catName LIKE :catName');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.articleCatRepository.createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        catName: `%${catName}%`,
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
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    let list = [];
    list.push(id);
    let childList = await this.articleCatRepository.find({
      where: {
        parentId: id,
      },
    });

    for (const item of childList) {
      let obj = { ...item };
      await this.selectChildrenIdsRecursive(item.id);
      list.push(obj.id);
    }

    return list;
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<ArticleCat[]> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      let res = await this.articleCatRepository.find();
      return Utils.construct(res, {
        id: 'id',
        pid: 'parentId',
        children: 'children',
      });
    } else {
      let result = await this.selectChildrenRecursive(parentId);

      return result;
    }
  }

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    let list = [];
    let childList = await this.articleCatRepository.find({
      where: {
        parentId: id,
      },
    });

    for (const item of childList) {
      let obj = { ...item };
      let child = await this.selectChildrenRecursive(item.id);
      if (child.length > 0) {
        obj['children'] = child;
        obj['hasChildren'] = true;
      } else {
        obj['children'] = [];
        obj['hasChildren'] = false;
      }
      list.push(obj);
    }

    return list;
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<ArticleCat> {
    let { id } = baseFindByIdDto;
    return await this.articleCatRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.articleCatRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateArticleCatDto: UpdateArticleCatDto, curUser?): Promise<void> {
    let { id } = updateArticleCatDto;

    let articleCat = new ArticleCat();
    articleCat = Utils.dto2entity(updateArticleCatDto, articleCat);

    await this.articleCatRepository.update(id, articleCat);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    // await this.articleCatRepository.delete(isExist);
    await this.articleCatRepository.createQueryBuilder()
      .delete()
      .from(ArticleCat)
      .where('id = :id', { id: id })
      .execute();
  }
}
