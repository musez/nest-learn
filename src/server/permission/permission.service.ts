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
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { Role } from '../role/entities/role.entity';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { Group } from '../group/entities/group.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

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
  async insert(createPermissionDto: CreatePermissionDto, curUser): Promise<Permission> {
    let permission = new Permission();
    permission = Utils.dto2entity(createPermissionDto, permission);
    permission.createBy = curUser!.id;

    return await this.permissionRepository.save(permission);
  }

  /**
   * 获取列表
   */
  async selectList(searchPermissionDto: SearchPermissionDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { parentId, kinship, name, type, status } = searchPermissionDto;

    kinship = kinship ? kinship : 0;

    const queryConditionList = [];
    let parentIds = null;
    if (!Utils.isBlank(parentId)) {
      // @ts-ignore
      if (parseInt(kinship) === 0) {
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
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
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
        status: status,
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
    let { page, limit, parentId, name, status } = limitPermissionDto;

    page = page ? page : 1;
    limit = limit ? limit : 10;
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
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.permissionRepository.createQueryBuilder()
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
        status: status,
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
   * 获取权限（用户 id）
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const userGroupPermissions = await this.permissionRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
      .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: id,
      })
      .getMany();

    const userPermissions = await this.permissionRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
      .innerJoinAndSelect(User, 'u', 'u.id = ur.userId')
      .where('u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: id,
      })
      .getMany();

    const res = Utils.uniqBy(Utils.concat(userGroupPermissions, userPermissions), 'id');

    return res;
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
  async update(updatePermissionDto: UpdatePermissionDto, curUser) {
    const { id, parentId, ...result } = updatePermissionDto;

    let permission = new Permission();
    permission = Utils.dto2entity(updatePermissionDto, permission);
    permission.updateBy = curUser!.id;

    return await this.permissionRepository.update(id, permission);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.permissionRepository.createQueryBuilder()
      .update(Permission)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.permissionRepository.createQueryBuilder()
      .update(Permission)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
