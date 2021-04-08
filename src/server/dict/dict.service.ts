import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict } from './entities/dict.entity';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BasePageDto } from '../base.dto';
import { DictItemService } from '../dict-item/dict-item.service';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';
import { File } from '../file/entities/file.entity';

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
    let dict = new Dict();
    dict = Utils.dto2entity(createDictDto, dict);
    dict.createBy = curUser.id;

    return await this.dictRepository.save(dict);
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
      .orderBy('createTime', 'DESC')
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
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    let { id } = baseFindByIdDto;
    return await this.dictRepository.findOne(id, {});
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.dictRepository.findOne(id);
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
    let { id } = updateDictDto;

    let dict = new Dict();
    dict = Utils.dto2entity(updateDictDto, dict);
    dict.updateBy = curUser.id;
    let result = await this.dictRepository.update(id, updateDictDto);

    return result;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    await this.dictRepository.createQueryBuilder()
      .delete()
      .from(Dict)
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<void> {
    let { ids } = baseFindByIdsDto;

    await this.dictRepository.createQueryBuilder()
      .delete()
      .from(Dict)
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
