import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { Area } from './entities/area.entity';
import { BaseFindByIdNumberDto, BaseFindByPIdDto } from '../base.dto';
import { LimitAreaDto } from './dto/limit-area.dto';
import { SearchAreaDto } from './dto/search-area.dto';
import { ApiException } from '../../common/exception/api-exception';
import { CreateAreaDto } from './dto/create-area.dto';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createAreaDto: CreateAreaDto[], curUser?): Promise<CreateAreaDto[] | void> {
    try {
      const areaList: CreateAreaDto[] = [];
      createAreaDto.forEach((item) => {
        let area = new Area();
        area = Utils.dto2entityImport(item, area);
        if (curUser) {
          area.createBy = curUser!.id;
        }
        areaList.push(area);
      });

      const ret = this.areaRepository.save(areaList);

      if (ret) {
        return ret;
      } else {
        throw new ApiException('保存异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（默认返回 []）
   */
  async selectList(searchAreaDto: SearchAreaDto): Promise<any[]> {
    try {
      const { parentId, areaName } = searchAreaDto;

      const queryConditionList = [];
      let parentIds = [];
      if (!Utils.isBlank(parentId)) {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        if (Utils.isArray(parentIds) && parentIds.length > 0) {
          queryConditionList.push('a.parentId IN (:...parentIds)');
        }
      }
      if (!Utils.isBlank(areaName)) {
        queryConditionList.push('a.areaName LIKE :areaName');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const res = await this.areaRepository
        .createQueryBuilder('a')
        .select(['a.*'])
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(*)')
              .from(Area, 'subA')
              .where('subA.parentId = a.id'),
          'hasChildren',
        )
        .orderBy({
          'a.areaCode': 'ASC',
          'a.createTime': 'DESC',
        })
        .where(queryCondition, {
          parentIds: parentIds,
          areaName: `%${areaName}%`,
        })
        .getRawMany();
      return res;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitAreaDto: LimitAreaDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, parentId, areaName } = limitAreaDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      let parentIds = [];
      if (!Utils.isBlank(parentId)) {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        if (Utils.isArray(parentIds) && parentIds.length > 0) {
          queryConditionList.push('parentId IN (:...parentIds)');
        }
      }
      if (!Utils.isBlank(areaName)) {
        queryConditionList.push('areaName LIKE :areaName');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const res = await this.areaRepository
        .createQueryBuilder()
        .where(queryCondition, {
          parentIds: parentIds,
          areaName: `%${areaName}%`,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          areaCode: 'ASC',
          createTime: 'DESC',
        })
        .getManyAndCount();

      return {
        list: res[0],
        total: res[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    try {
      const list = [];
      const childList = await this.areaRepository.find({
        where: {
          parentId: id,
        },
      });

      for (const item of childList) {
        const obj = { ...item };
        await this.selectChildrenIdsRecursive(item.id);
        list.push(obj.id);
      }

      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（父 id）
   */
  async selectListByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<Area[]> {
    try {
      let { parentId } = baseFindByPIdDto;

      if (Utils.isBlank(parentId)) {
        parentId = '-1';
      }

      return await this.areaRepository.find({
        where: {
          parentId: parentId,
        },
      });
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    try {
      const { parentId } = baseFindByPIdDto;

      if (Utils.isBlank(parentId)) {
        const res = await this.areaRepository.find();

        return Utils.construct(res, {
          id: 'id',
          pid: 'parentId',
          children: 'children',
        });
      } else {
        const result = await this.selectChildrenRecursive(parentId);

        return result;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    try {
      const list = [];
      const childList = await this.areaRepository.find({
        where: {
          parentId: id,
        },
      });

      for (const item of childList) {
        const obj = { ...item };
        const child = await this.selectChildrenRecursive(item.id);
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
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdNumberDto: BaseFindByIdNumberDto): Promise<Area> {
    const { id } = baseFindByIdNumberDto;
    return await this.areaRepository.findOne(id);
  }

  /**
   * 是否存在（地区编码）
   */
  async isExistAreaCode(areaCode: string): Promise<boolean> {
    try {
      const isExist = await this.areaRepository.findOne({ areaCode: areaCode });
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
