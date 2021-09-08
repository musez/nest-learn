import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';
import { ArticleCat } from './entities/article-cat.entity';
import { Utils } from '../../utils';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseFindByPIdDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';
import { ApiException } from '../../common/exception/api-exception';

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
    if (curUser) {
      articleCat.createBy = curUser!.id;
    }
    return await this.articleCatRepository.save(createArticleCatDto);
  }

  /**
   * 获取全部
   */
  async selectAll(searchArticleCatDto: SearchArticleCatDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { catName, status } = searchArticleCatDto;

    const queryConditionList = [];
    if (!Utils.isBlank(catName)) {
      queryConditionList.push('catName LIKE :catName');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:..status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.articleCatRepository
      .createQueryBuilder('ac')
      .select(['ac.*'])
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(*)')
            .from(ArticleCat, 'subAC')
            .where('subAC.parentId = ac.id'),
        'hasChildren',
      )
      .orderBy({
        status: 'DESC',
        createTime: 'DESC',
      })
      .where(queryCondition, {
        catName: `%${catName}%`,
        status: status,
      })
      .getRawMany();
    return res;
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleCatDto: SearchArticleCatDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { parentId, kinship, catName, status } = searchArticleCatDto;

    const queryConditionList = [];
    let parentIds = null;

    if (!Utils.isBlank(parentId)) {
      // @ts-ignore
      if (parseInt(kinship) === 0) {
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
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.articleCatRepository
      .createQueryBuilder('ac')
      .select(['ac.*'])
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(*)')
            .from(ArticleCat, 'subAC')
            .where('subAC.parentId = ac.id'),
        'hasChildren',
      )
      .orderBy({
        status: 'DESC',
        createTime: 'DESC',
      })
      .where(queryCondition, {
        parentIds: parentIds,
        catName: `%${catName}%`,
        status: status,
      })
      .getRawMany();
    return res;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleCatDto: LimitArticleCatDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, parentId, catName, status } = limitArticleCatDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:...parentIds)');
    }
    if (!Utils.isBlank(catName)) {
      queryConditionList.push('catName LIKE :catName');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.articleCatRepository
      .createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        catName: `%${catName}%`,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        status: 'DESC',
        createTime: 'DESC',
      })
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
    const list = [];
    list.push(id);
    const childList = await this.articleCatRepository.find({
      where: {
        parentId: id,
        deleteStatus: 0,
      },
    });

    for (const item of childList) {
      const obj = { ...item };
      await this.selectChildrenIdsRecursive(item.id);
      list.push(obj.id);
    }

    return list;
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<ArticleCat[]> {
    const { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      const res = await this.articleCatRepository.find({
        deleteStatus: 0,
      });
      return Utils.construct(res, {
        id: 'id',
        pid: 'parentId',
        children: 'children',
      });
    } else {
      const result = await this.selectChildrenRecursive(parentId);

      return result;
    }
  }

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    const list = [];
    const childList = await this.articleCatRepository.find({
      where: {
        parentId: id,
        deleteStatus: 0,
      },
    });

    for (const item of childList) {
      const obj = { ...item };
      const child = await this.selectChildrenRecursive(item.id);
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
    const { id } = baseFindByIdDto;
    return await this.articleCatRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.articleCatRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateArticleCatDto: UpdateArticleCatDto, curUser?): Promise<void> {
    const { id } = updateArticleCatDto;

    let articleCat = new ArticleCat();
    articleCat = Utils.dto2entity(updateArticleCatDto, articleCat);

    await this.articleCatRepository.update(id, articleCat);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { ids, status } = baseModifyStatusByIdsDto;
    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    const ret = this.articleCatRepository
      .createQueryBuilder()
      .update(ArticleCat)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', 500, 200);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.articleCatRepository
      .createQueryBuilder()
      .update(ArticleCat)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    await this.articleCatRepository
      .createQueryBuilder()
      .update(ArticleCat)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }
}
