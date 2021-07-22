import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Utils } from './../../utils/index';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto } from '../base.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { LimitPermissionDto } from './dto/limit-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createPermissionDto: CreatePermissionDto, curUser?): Promise<Permission> {
    const { parentId, ...result } = createPermissionDto;

    const child = new Permission();
    for (const key in result) {
      child[key] = result[key];
    }

    return await this.permissionRepository.save(child);
  }

  /**
   * 获取列表
   */
  async selectList(searchPermissionDto: SearchPermissionDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { parentId, kinship, name, type } = searchPermissionDto;

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
    if (!Utils.isBlank(type)) {
      if (Array.isArray(type)) {
        queryConditionList.push('type IN (:...type)');
      } else {
        queryConditionList.push('type = type');
      }
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.permissionRepository.createQueryBuilder('p')
      .select(['p.*'])
      .addSelect(subQuery =>
        subQuery.select('COUNT(*)')
          .from(Permission, 'subP')
          .where('subP.parentId = p.id'), 'hasChildren')
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
        type: type,
      })
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
      })
      .getRawMany();

    return res;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitPermissionDto: LimitPermissionDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, parentId, name } = limitPermissionDto;

    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('parentId IN (:...parentIds)');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.permissionRepository.createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
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
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    const list = [];
    list.push(id);
    const childList = await this.permissionRepository.find({
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
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<Permission[]> {
    const { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      const res = await this.permissionRepository.find({
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
    const childList = await this.permissionRepository.find({
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    const { id } = baseFindByIdDto;
    return await this.permissionRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.permissionRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updatePermissionDto: UpdatePermissionDto, curUser?) {
    const { id, parentId, ...result } = updatePermissionDto;

    const child = new Permission();
    for (const key in result) {
      child[key] = result[key];
    }

    return await this.permissionRepository.update(id, child);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.permissionRepository.createQueryBuilder()
      .update(Permission)
      .set({ deleteStatus: 1, deleteBy: curUser&&curUser.id })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.permissionRepository.createQueryBuilder()
      .update(Permission)
      .set({ deleteStatus: 1, deleteBy: curUser&&curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
