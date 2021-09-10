import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { Org } from './entities/org.entity';
import { Utils } from '../../utils';
import { SearchOrgDto } from './dto/search-org.dto';
import { LimitOrgDto } from './dto/limit-org.dto';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseFindByPIdDto, BaseModifyStatusByIdsDto,
} from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private readonly orgRepository: Repository<Org>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createOrgDto: CreateOrgDto, curUser?): Promise<CreateOrgDto> {
    let role = new Org();
    role = Utils.dto2entity(createOrgDto, role);
    if (curUser) {
      role.createBy = curUser!.id;
    }
    return await this.orgRepository.save(role);
  }

  /**
   * 获取全部
   */
  async selectAll(searchOrgDto: SearchOrgDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { name, status } = searchOrgDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
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
  }

  /**
   * 获取列表
   */
  async selectList(searchOrgDto: SearchOrgDto): Promise<any[]> {
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
        queryConditionList.push('parentId IN (:...parentIds)');
      }
    } else {
      queryConditionList.push('parentId IS NULL');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
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
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitOrgDto: LimitOrgDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, parentId, name, status } = limitOrgDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('org.parentId IN (:...parentIds)');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('org.name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
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
  }

  /**
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    const list = [];
    list.push(id);
    const childList = await this.orgRepository.find({
      where: {
        parentId: id,
        deleteStatus: 0,
      },
    });

    for (const item of childList) {
      const obj = { ...item };
      await this.selectChildrenIdsRecursive(item.id);
      list.push(obj.id);
    }

    return list;
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    const { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      const res = await this.orgRepository.find({
        deleteStatus: 0,
      });
      return Utils.construct(res, {
        id: 'id',
        pid: 'parentId',
        children: 'children',
      });
    } else {
      const result = await this.selectChildrenRecursive(parentId);

      return result;
    }
  }

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    const list = [];
    const childList = await this.orgRepository.find({
      where: {
        parentId: id,
        deleteStatus: 0,
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
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Org> {
    const { id } = baseFindByIdDto;
    return await this.orgRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.orgRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 获取是否有子分类（主键 id）
   */
  async isExistChildrenById(baseFindByIdDto: BaseFindByIdDto): Promise<boolean> {
    const { id } = baseFindByIdDto;
    const ret = await this.orgRepository.findOne({ parentId: id, deleteStatus: 1 });
    if (ret) return true;
    else return false;
  }

  /**
   * 修改
   */
  async update(updateOrgDto: UpdateOrgDto, curUser?): Promise<void> {
    const { id } = updateOrgDto;

    let org = new Org();
    org = Utils.dto2entity(updateOrgDto, org);
    if (curUser) {
      org.updateBy = curUser!.id;
    }

    await this.orgRepository.update(id, org);
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
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    const ret = await this.isExistChildrenById(baseFindByIdDto);
    if (ret) {
      throw new ApiException('存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
    }

    await this.orgRepository
      .createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?,): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }

    for (const id of ids) {
      const ret = await this.isExistChildrenById({ id });
      if (ret) {
        throw new ApiException('存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
      }
    }

    await this.orgRepository
      .createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }
}
