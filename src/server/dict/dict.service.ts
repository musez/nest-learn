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

  /**
   * 添加
   */
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

    return await this.dictRepository.save(dict);
    // return await this.dictItemService.insertBatch(dictItemList);
  }

  /**
   * 获取列表
   */
  async selectList(searchDictDto: SearchDictDto): Promise<Dict[]> {
    let { dictName } = searchDictDto;

    let queryConditionList = [];

    if (!Utils.isBlank(dictName)) {
      queryConditionList.push('dictName LIKE :dictName');
    }

    let queryCondition = queryConditionList.join(' AND ');

    return await this.dictRepository.createQueryBuilder()
      .where(queryCondition, {
        dictName: `%${dictName}%`,
      })
      .orderBy('createTime', 'ASC')
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDictDto: LimitDictDto): Promise<any> {
    let { page, limit, dictName } = limitDictDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    if (!Utils.isBlank(dictName)) {
      queryConditionList.push('dictName LIKE :dictName');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.dictRepository.createQueryBuilder()
      .where(queryCondition, {
        dictName: `%${dictName}%`,
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

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    let { id } = baseFindByIdDto;
    return await this.dictRepository.findOne(id, {
      relations: ['dictItems'],
    });
  }

  /**
   * 修改
   */
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

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.dictRepository.delete(isExist);
  }
}
