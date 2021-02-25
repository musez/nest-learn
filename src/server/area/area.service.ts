import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { Area } from './entities/area.entity';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { LimitAreaDto } from './dto/limit-area.dto';
import { SearchAreaDto } from './dto/search-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
  }

  async selectList(limitAreaDto: LimitAreaDto): Promise<Area[]> {
    let { areaName } = limitAreaDto;

    if (Utils.isNil(areaName)) {
      return [];
    }

    return await this.areaRepository.find({
      where: {
        areaName: Like(`%${areaName}%`),
      },
    });
  }

  async selectListPage(limitAreaDto: LimitAreaDto): Promise<any> {
    let { page, limit, parentId, areaName } = limitAreaDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    let parentIds = [];
    if (!Utils.isNil(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId in (:parentIds)');
    }
    if (!Utils.isNil(areaName)) {
      queryConditionList.push('areaName = :areaName');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.areaRepository.createQueryBuilder()
      .where(queryCondition, {
        parentId: parentIds,
        areaName: `%${areaName}%`,
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

  async selectListByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<Area[]> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isNil(parentId)) {
      parentId = '-1';
    }

    return await this.areaRepository.find({
      where: {
        parentId: parentId,
      },
    });
  }

  async selectTree(): Promise<any> {
    let res = await this.areaRepository.find();
    return Utils.construct(res, {
      id: 'id',
      pid: 'parentId',
      children: 'children',
    });
  }

  async selectTreeByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isNil(parentId)) {
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

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Area> {
    let { id } = baseFindByIdDto;
    return await this.areaRepository.findOne(id);
  }
}
