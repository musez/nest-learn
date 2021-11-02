import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { Org } from './entities/org.entity';
import { Utils } from '../../utils';
import { SearchOrgDto } from './dto/search-org.dto';
import { LimitOrgDto } from './dto/limit-org.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class OrgService {
  private readonly logger = new Logger(OrgService.name);

  constructor(
    @InjectRepository(Org)
    private readonly orgRepository: Repository<Org>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createOrgDto: CreateOrgDto, curUser?): Promise<CreateOrgDto> {
    try {
      let role = new Org();
      role = Utils.dto2entity(createOrgDto, role);
      if (curUser) {
        role.createBy = curUser!.id;
      }
      return await this.orgRepository.save(role);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取全部
   */
  async selectAll(searchOrgDto: SearchOrgDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { name, status } = searchOrgDto;

      const queryConditionList = [];
      if (!Utils.isBlank(name)) {
        queryConditionList.push('name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const res = await this.orgRepository
        .createQueryBuilder('o')
        .select(['o.*'])
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(*)')
              .from(Org, 'subO')
              .where('subO.parentId = o.id'),
          'hasChildren',
        )
        .where(queryCondition, {
          name: `%${name}%`,
          status: status,
        })
        .orderBy({
          status: 'DESC',
          createTime: 'DESC',
        })
        .getRawMany();
      return res;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchOrgDto: SearchOrgDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { parentId, kinship, name, status } = searchOrgDto;

      kinship = kinship ? kinship : 0;

      const queryConditionList = [];
      let parentIds = null;
      if (!Utils.isBlank(parentId)) {
        if (kinship === 0) {
          parentIds = parentId;
          queryConditionList.push('parentId = :parentIds');
        } else {
          parentIds = await this.selectChildrenIdsRecursive(parentId);
          if (Utils.isArray(parentIds) && parentIds.length > 0) {
            queryConditionList.push('parentId IN (:parentIds)');
          }
        }
      } else {
        queryConditionList.push('parentId IS NULL');
      }
      if (!Utils.isBlank(name)) {
        queryConditionList.push('name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const res = await this.orgRepository
        .createQueryBuilder('o')
        .select(['o.*'])
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(*)')
              .from(Org, 'subO')
              .where('subO.parentId = o.id'),
          'hasChildren',
        )
        .where(queryCondition, {
          parentIds: parentIds,
          name: `%${name}%`,
          status: status,
        })
        .orderBy({
          status: 'DESC',
          createTime: 'DESC',
        })
        .getRawMany();
      return res;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitOrgDto: LimitOrgDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, parentId, name, status } = limitOrgDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      let parentIds = [];
      if (!Utils.isBlank(parentId)) {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        if (Utils.isArray(parentIds) && parentIds.length > 0) {
          queryConditionList.push('org.parentId IN (:parentIds)');
        }
      }
      if (!Utils.isBlank(name)) {
        queryConditionList.push('org.name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const res = await this.orgRepository
        .createQueryBuilder('org')
        .leftJoinAndSelect(Org, 'p', 'p.id = org.parentId')
        .where(queryCondition, {
          parentIds: parentIds,
          name: `%${name}%`,
          status: status,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          'org.status': 'DESC',
          'org.createTime': 'DESC',
        })
        .getManyAndCount();

      return {
        list: res[0],
        total: res[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    try {
      const list = [];
      list.push(id);
      const childList = await this.orgRepository.find({
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
      this.logger.error('系统异常：', e);
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
        const res = await this.orgRepository.find();
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
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    try {
      const list = [];
      const childList = await this.orgRepository.find({
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
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Org> {
    try {
      const { id } = baseFindByIdDto;
      return await this.orgRepository.findOne(id);
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
      const isExist = await this.orgRepository.findOne(id);
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
   * 获取是否有子分类（主键 id）
   */
  async isExistChildrenById(baseFindByIdDto: BaseFindByIdDto): Promise<boolean> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.orgRepository.findOne({ parentId: id });
      if (ret) return true;
      else return false;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateOrgDto: UpdateOrgDto, curUser?): Promise<void> {
    try {
      const { id, parentId } = updateOrgDto;

      if (id === parentId) {
        throw new ApiException('不能选择自身为父级！', ApiErrorCode.PARAMS_ERROR, HttpStatus.OK);
      }

      let org = new Org();
      org = Utils.dto2entity(updateOrgDto, org);
      if (curUser) {
        org.updateBy = curUser!.id;
      }

      await this.orgRepository.update(id, org);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态（批量，主键 ids）
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { ids, status } = baseModifyStatusByIdsDto;
      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      const ret = this.orgRepository
        .createQueryBuilder()
        .update(Org)
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
   * 删除（主键 id）
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.isExistChildrenById(baseFindByIdDto);
      if (ret) {
        throw new ApiException('分类下存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
      }

      await this.orgRepository
        .createQueryBuilder()
        .delete()
        .from(Org)
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量，主键 ids）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }

      for (const id of ids) {
        const ret = await this.isExistChildrenById({ id });
        if (ret) {
          throw new ApiException('分类下存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
        }
      }

      await this.orgRepository
        .createQueryBuilder()
        .delete()
        .from(Org)
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
