import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { Area } from './entities/area.entity';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { LimitAreaDto } from './dto/limit-area.dto';
import { Permission } from '../permission/entities/permission.entity';

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
  async selectList(limitAreaDto: LimitAreaDto): Promise<Area[]> {
    let { parentId, areaName } = limitAreaDto;

    if (Utils.isBlank(parentId) && Utils.isBlank(areaName)) {
      return [];
    }

    let queryConditionList = [];

    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:...parentIds)');
    }

    if (!Utils.isBlank(areaName)) {
      queryConditionList.push('areaName LIKE :areaName');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.areaRepository.createQueryBuilder('a')
      .select(['a.*'])
      .addSelect(subQuery =>
        subQuery.select('COUNT(*)')
          .from(Permission, 'subA')
          .where('subA.parentId = a.id'), 'hasChildren')
      .orderBy('createTime', 'DESC')
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
    let { page, limit, parentId, areaName } = limitAreaDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:parentIds)');
    }
    if (!Utils.isBlank(areaName)) {
      queryConditionList.push('areaName LIKE :areaName');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.areaRepository.createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        areaName: `%${areaName}%`,
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
    let childList = await this.areaRepository.find({
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
    let { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      let res = await this.areaRepository.find();
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
    let childList = await this.areaRepository.find({
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
  async selectById(id: string): Promise<Area> {
    return await this.areaRepository.findOne(id);
  }
}
