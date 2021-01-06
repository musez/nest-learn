import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, Like } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
  }

  async selectList(query): Promise<Area[]> {
    let { areaName } = query;

    if (!areaName) {
      areaName = '';
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

    if (!areaName) {
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

  // async selectTree(): Promise<Area[]> {
  //   return await this.areaService.findTrees();
  // }
}
