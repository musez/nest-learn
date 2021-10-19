import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { SearchDictCodeDto } from './dto/search-dict-code.dto';

@Injectable()
export class DictService {
  private readonly logger = new Logger(DictService.name);

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
    try {
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
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchDictDto: SearchDictDto): Promise<Dict[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { dictName, dictCode, status } = searchDictDto;

      const queryConditionList = [];
      if (!Utils.isBlank(dictName)) {
        queryConditionList.push('dict.dictName LIKE :dictName');
      }
      if (!Utils.isBlank(dictCode)) {
        queryConditionList.push('dict.dictCode LIKE :dictCode');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('dict.status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      return await this.dictRepository
        .createQueryBuilder('dict')
        .leftJoinAndSelect('dict.dictItems', 'dictItems')
        .where(queryCondition, {
          dictName: `%${dictName}%`,
          dictCode: `%${dictCode}%`,
          status: status,
        })
        .orderBy({
          'dict.status': 'DESC',
          'dict.createTime': 'DESC',
        })
        .getMany();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDictDto: LimitDictDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, dictName, dictCode, status } = limitDictDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(dictName)) {
        queryConditionList.push('dict.dictName LIKE :dictName');
      }
      if (!Utils.isBlank(dictCode)) {
        queryConditionList.push('dict.dictCode LIKE :dictCode');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('dict.status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.dictRepository
        .createQueryBuilder('dict')
        .leftJoinAndSelect('dict.dictItems', 'dictItems')
        .where(queryCondition, {
          dictName: `%${dictName}%`,
          dictCode: `%${dictCode}%`,
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
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    try {
      const { id } = baseFindByIdDto;
      return await this.dictRepository.findOne({
        relations: ['dictItems'],
        where: {
          id: id,
        },
      });
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（dictCode）
   */
  async selectByDictCode(searchDictCodeDto: SearchDictCodeDto): Promise<Dict> {
    try {
      const { dictCode } = searchDictCodeDto;
      return await this.dictRepository.findOne({
        relations: ['dictItems'],
        where: {
          dictCode: dictCode,
        },
      });
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.dictRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateDictDto: UpdateDictDto, curUser?): Promise<any> {
    try {
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
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    try {
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
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async updateItems(updateDictDto: UpdateDictDto, curUser?): Promise<any> {
    try {
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
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      await this.dictRepository
        .createQueryBuilder()
        .delete()
        .from(Dict)
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      await this.dictRepository
        .createQueryBuilder()
        .delete()
        .from(Dict)
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
