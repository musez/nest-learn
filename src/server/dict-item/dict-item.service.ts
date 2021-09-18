import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItem } from './entities/dict-item.entity';
import { Utils } from '../../utils';
import { SearchDictItemDto } from './dto/search-dict-item.dto';
import { LimitDictItemDto } from './dto/limit-dict-item.dto';
import { BaseFindByIdDto } from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
  async insert(createDictItemDto: CreateDictItemDto, curUser?): Promise<CreateDictItemDto> {
    try {
      let dictItem = new DictItem();
      dictItem = Utils.dto2entity(createDictItemDto, dictItem);
      if (curUser) {
        dictItem.createBy = curUser!.id;
      }
      return await this.dictItemRepository.save(dictItem);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createDictItemDto: CreateDictItemDto[], curUser?): Promise<CreateDictItemDto[] | DictItem[]> {
    try {
      const dictItems = [];

      createDictItemDto.forEach((item) => {
        let dictItem = new DictItem();
        dictItem = Utils.dto2entity(item, dictItem);
        if (curUser) {
          dictItem.createBy = curUser!.id;
        }
        dictItems.push(dictItem);
      });

      return await this.dictItemRepository.save(dictItems);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchDictItemDto: SearchDictItemDto): Promise<DictItem[]> {
    try {
      const { itemText, dictId } = searchDictItemDto;

      const queryConditionList = [];
      if (!Utils.isBlank(itemText)) {
        queryConditionList.push('itemText LIKE :itemText');
      }
      if (!Utils.isBlank(dictId)) {
        queryConditionList.push('dictId = :dictId');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      return await this.dictItemRepository
        .createQueryBuilder()
        .where(queryCondition, {
          itemText: `%${itemText}%`,
          dictId: dictId,
        })
        .orderBy({
          status: 'DESC',
          sort: 'ASC',
          createTime: 'DESC',
        })
        .getMany();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDictItemDto: LimitDictItemDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, itemText } = limitDictItemDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(itemText)) {
        queryConditionList.push('itemText LIKE :itemText');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.dictItemRepository
        .createQueryBuilder()
        .where(queryCondition, {
          itemText: `%${itemText}%`,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          status: 'DESC',
          sort: 'ASC',
          createTime: 'DESC',
        })
        .getManyAndCount();

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectByDictId(baseFindByIdDto: BaseFindByIdDto): Promise<DictItem[]> {
    try {
      const { id } = baseFindByIdDto;

      const queryConditionList = [];
      if (!Utils.isBlank(id)) {
        queryConditionList.push('dictId = :id');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      return await this.dictItemRepository
        .createQueryBuilder()
        .where(queryCondition, {
          id: id,
        })
        .orderBy({
          status: 'DESC',
          sort: 'ASC',
          createTime: 'DESC',
        })
        .getMany();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（字典 id）
   */
  async deleteByDictId(id: string, curUser?): Promise<void> {
    try {
      await this.dictItemRepository
        .createQueryBuilder()
        .update(DictItem)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('dictId = :id', { id: id })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
