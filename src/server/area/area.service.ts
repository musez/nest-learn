import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { Area } from './entities/area.entity';
import { BaseFindByPIdDto } from '../base.dto';
import { LimitAreaDto } from './dto/limit-area.dto';
import { SearchAreaDto } from './dto/search-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
  }

  /**
   * 获取列表（默认返回 []）
   */
  async selectList(searchAreaDto: SearchAreaDto): Promise<any[]> {
    const { parentId, areaName } = searchAreaDto;

    const queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:...parentIds)');
    }
    if (!Utils.isBlank(areaName)) {
      queryConditionList.push('areaName LIKE :areaName');
    }
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.areaRepository.createQueryBuilder('a')
      .select(['a.*'])
      .addSelect(subQuery =>
        subQuery.select('COUNT(*)')
          .from(Area, 'subA')
          .where('subA.parentId = a.id'), 'hasChildren')
      .orderBy({ 'createTime': 'DESC' })
      .where(queryCondition, {
        parentIds: parentIds,
        areaName: `%${areaName}%`,
      })
      .getRawMany();
    return res;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitAreaDto: LimitAreaDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, parentId, areaName } = limitAreaDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:parentIds)');
    }
    if (!Utils.isBlank(areaName)) {
      queryConditionList.push('areaName LIKE :areaName');
    }
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.areaRepository.createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        areaName: `%${areaName}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'createTime': 'DESC' })
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
    const childList = await this.areaRepository.find({
      where: {
        parentId: id,
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
   * 获取列表（父 id）
   */
  async selectListByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<Area[]> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      parentId = '-1';
    }

    return await this.areaRepository.find({
      where: {
        parentId: parentId,
      },
    });
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    const { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      const res = await this.areaRepository.find();
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
    const childList = await this.areaRepository.find({
      where: {
        parentId: id,
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
  async selectById(id: string): Promise<Area> {
    return await this.areaRepository.findOne(id);
  }
}
