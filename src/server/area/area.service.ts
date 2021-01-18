import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, Like } from 'typeorm';
import { construct } from '@aximario/json-tree';
import * as _ from 'lodash';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
  }

  async selectList(query): Promise<Area[]> {
    let { areaName } = query;

    if (_.isEmpty(areaName)) {
      return [];
    }

    return await this.areaRepository.find({
      where: {
        areaName: Like(`%${areaName}%`),
      },
    });
  }

  async selectListPage(page, limit, query): Promise<any> {
    let { areaName } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (_.isEmpty(areaName)) {
      areaName = '';
    }

    let res = await this.areaRepository.createQueryBuilder('area')
      .skip(offset)
      .take(limit)
      .orderBy('area.createTime', 'ASC')
      .where('area.areaName like :areaName', { areaName: `%${areaName}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Area> {
    let { id } = baseFindByIdDto;
    return await this.areaRepository.findOne(id);
  }

  async selectListByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<Area[]> {
    let { parentId } = baseFindByPIdDto;

    if (_.isEmpty(parentId)) {
      parentId = '-1';
    }

    return await this.areaRepository.find({
      where: {
        parentId: parentId,
      },
    });
  }

  async selectTreeByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    let { parentId } = baseFindByPIdDto;

    if (_.isEmpty(parentId)) {
      let res = await this.areaRepository.find();
      return construct(res, {
        id: 'id',
        pid: 'parentId',
        children: 'children',
      });
    } else {
      let result = await this.selectChildren(parentId);

      return result;
    }
  }

  async selectChildren(id): Promise<any> {
    let list = [];
    let childList = await this.areaRepository.find({
      where: {
        parentId: id,
      },
    });

    for (const item of childList) {
      let obj = { ...item };
      let child = await this.selectChildren(item.id);
      if (child.length > 0) {
        obj['children'] = child;
      } else {
        obj['children'] = [];
      }
      list.push(obj);
    }

    return list;
  }
}
