import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict } from './entities/dict.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { DictItemService } from '../dict-item/dict-item.service';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { ApiException } from '../../common/exception/api-exception';

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
    const dictItems = [];
    for (const item of createDictDto.dictItems) {
      let dictItem = new DictItem();
      dictItem = Utils.dto2entity(item, dictItem);
      dictItems.push(dictItem);

      await this.dictItemService.insert(dictItem, curUser);
    }

    let dict = new Dict();
    dict = Utils.dto2entity(createDictDto, dict);
    dict.dictItems = dictItems;
    if (curUser) {
      dict.createBy = curUser!.id;
    }
    return await this.dictRepository.save(dict);
  }

  /**
   * 获取列表
   */
  async selectList(searchDictDto: SearchDictDto): Promise<Dict[]> {
    // eslint-disable-next-line prefer-const
    let { dictName, status } = searchDictDto;

    const queryConditionList = [];
    if (!Utils.isBlank(dictName)) {
      queryConditionList.push('dict.dictName LIKE :dictName');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('dict.status IN (:...status)');
    }
    queryConditionList.push('dict.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.dictRepository
      .createQueryBuilder('dict')
      .leftJoinAndSelect('dict.dictItems', 'dictItems')
      .where(queryCondition, {
        dictName: `%${dictName}%`,
        status: status,
      })
      .orderBy({
        'dict.status': 'DESC',
        'dict.createTime': 'DESC',
      })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDictDto: LimitDictDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, dictName, status } = limitDictDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(dictName)) {
      queryConditionList.push('dict.dictName LIKE :dictName');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        // @ts-ignore
        status = Utils.split(status.toString());
      }
      queryConditionList.push('dict.status IN (:...status)');
    }
    queryConditionList.push('dict.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.dictRepository
      .createQueryBuilder('dict')
      .leftJoinAndSelect('dict.dictItems', 'dictItems')
      .where(queryCondition, {
        dictName: `%${dictName}%`,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'dict.status': 'DESC',
        'dict.createTime': 'DESC',
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
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    const { id } = baseFindByIdDto;
    return await this.dictRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateDictDto: UpdateDictDto, curUser?): Promise<any> {
    const { id } = updateDictDto;

    const dictItems = [];
    for (const item of updateDictDto.dictItems) {
      let dictItem = new DictItem();
      dictItem = Utils.dto2entity(item, dictItem);
      dictItems.push(dictItem);

      await this.dictItemService.insert(dictItem, curUser);
    }

    let dict = new Dict();
    dict = Utils.dto2entity(updateDictDto, dict);
    dict.dictItems = dictItems;
    if (curUser) {
      dict.updateBy = curUser!.id;
    }

    return await this.dictRepository.save(dict);
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
    const ret = this.dictRepository
      .createQueryBuilder()
      .update(Dict)
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

    await this.dictRepository
      .createQueryBuilder()
      .update(Dict)
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
    await this.dictRepository
      .createQueryBuilder()
      .update(Dict)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }
}
