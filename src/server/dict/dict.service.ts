import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict } from './entities/dict.entity';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { DictItemService } from '../dict-item/dict-item.service';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
    private readonly dictItemService: DictItemService,
  ) {
  }

  async insert(createDictDto: CreateDictDto, curUser?) {
    let { dictItems } = createDictDto;

    let dict = new Dict();
    dict = Utils.dto2entity(createDictDto, dict);
    dict.createBy = curUser.id;

    let dictItemList = [];
    if (dictItems) {
      for (const key in dictItems) {
        let dictItem = new DictItem();

        for (const itemKey in dictItems[key]) {
          if (dictItems[key][itemKey]) {
            dictItem[itemKey] = dictItems[key][itemKey];
          }
        }
        dictItem.dict = dict;

        dictItemList.push(dictItem);
      }
    }

    await this.dictRepository.save(dict);
    return await this.dictItemService.insertBatch(dictItemList);
  }

  async selectList(searchDictDto: SearchDictDto): Promise<Dict[]> {
    let { dictName } = searchDictDto;

    if (Utils.isNil(dictName)) {
      dictName = '';
    }

    return await this.dictRepository.find({
      where: {
        dictName: Like(`%${dictName}%`),
      },
    });
  }

  async selectListPage(limitDictDto: LimitDictDto): Promise<any> {
    let { page, limit } = limitDictDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let res = await this.dictRepository.createQueryBuilder()
      .orderBy('createTime', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectDictItemList(): Promise<Dict[]> {
    return await this.dictRepository.find({
      relations: ['dictItems'],
    });
  }

  async selectDictItemListPage(basePageDto: BasePageDto): Promise<any> {
    let { page, limit } = basePageDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let res = await this.dictRepository.createQueryBuilder()
      .innerJoinAndSelect('dictItems', 'dictItems')
      .orderBy('createTime', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    let { id } = baseFindByIdDto;
    return await this.dictRepository.findOne(id, {
      relations: ['dictItems'],
    });
  }

  async update(updateDictDto: UpdateDictDto, curUser?): Promise<any> {
    let { id, dictItems } = updateDictDto;

    let isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let dict = new Dict();
    dict = Utils.dto2entity(updateDictDto, dict);
    dict.updateBy = curUser.id;

    if (dictItems) {
      for (const key in dictItems) {
        let dictItem = new DictItem();

        for (const itemKey in dictItems[key]) {
          if (dictItems[key][itemKey]) {
            dictItem[itemKey] = dictItems[key][itemKey];
          }
        }
        dictItem.dict = dict;
      }
    }

    let result = await this.dictRepository.save(updateDictDto);

    return result;
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.dictRepository.remove(isExist);
  }
}
