import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItem } from './entities/dict-item.entity';
import { Utils } from '../../utils';
import { LimitDictDto } from '../dict/dto/limit-dict.dto';
import { SearchDictItemDto } from './dto/search-dict-item.dto';
import { LimitDictItemDto } from './dto/limit-dict-item.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Dict } from '../dict/entities/dict.entity';

@Injectable()
export class DictItemService {
  constructor(
    @InjectRepository(DictItem)
    private readonly dictItemRepository: Repository<DictItem>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createDictItemDto: CreateDictItemDto, curUser): Promise<CreateDictItemDto> {
    let dictItem = new DictItem();
    dictItem = Utils.dto2entity(createDictItemDto, dictItem);
    dictItem.createBy = curUser.id;
    return await this.dictItemRepository.save(dictItem);
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createDictItemDto: CreateDictItemDto[], curUser): Promise<CreateDictItemDto[]> {
    let dictItems = [];

    createDictItemDto.forEach(item => {
      let dictItem = new DictItem();
      dictItem = Utils.dto2entity(item, dictItem);
      dictItem.createBy = curUser.id;
      dictItems.push(dictItem);
    });

    return await this.dictItemRepository.save(dictItems);
  }

  /**
   * 获取列表
   */
  async selectList(searchDictItemDto: SearchDictItemDto): Promise<DictItem[]> {
    let { itemText, dictId } = searchDictItemDto;

    let queryConditionList = [];

    if (!Utils.isBlank(itemText)) {
      queryConditionList.push('itemText LIKE :itemText');
    }

    if (!Utils.isBlank(dictId)) {
      queryConditionList.push('dictId = :dictId');
    }

    let queryCondition = queryConditionList.join(' AND ');

    return await this.dictItemRepository.createQueryBuilder()
      .where(queryCondition, {
        itemText: `%${itemText}%`,
        dictId: dictId,
      })
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
      })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDictItemDto: LimitDictItemDto): Promise<any> {
    let { page, limit, itemText } = limitDictItemDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    if (!Utils.isBlank(itemText)) {
      queryConditionList.push('itemText LIKE :itemText');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.dictItemRepository.createQueryBuilder()
      .where(queryCondition, {
        itemText: `%${itemText}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
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
   * 获取列表
   */
  async selectByDictId(baseFindByIdDto: BaseFindByIdDto): Promise<DictItem[]> {
    let { id } = baseFindByIdDto;

    let queryConditionList = [];

    if (!Utils.isBlank(id)) {
      queryConditionList.push('dictId = :id');
    }

    let queryCondition = queryConditionList.join(' AND ');

    return await this.dictItemRepository.createQueryBuilder()
      .where(queryCondition, {
        id: id,
      })
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
      })
      .getMany();
  }

  /**
   * 删除（字典 id）
   */
  async deleteByDictId(id: string): Promise<void> {
    await this.dictItemRepository.createQueryBuilder()
      .delete()
      .from(DictItem)
      .where('dictId = :id', { id: id })
      .execute();
  }
}
