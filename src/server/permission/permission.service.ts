import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { LimitPermissionDto } from './dto/limit-permission.dto';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { Role } from '../role/entities/role.entity';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { Group } from '../group/entities/group.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createPermissionDto: CreatePermissionDto, curUser?): Promise<Permission> {
    try {
      let permission = new Permission();
      permission = Utils.dto2entity(createPermissionDto, permission);
      if (curUser) {
        permission.createBy = curUser!.id;
      }

      return await this.permissionRepository.save(permission);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取全部
   */
  async selectAll(searchPermissionDto: SearchPermissionDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { name, type, status } = searchPermissionDto;

      const queryConditionList = [];
      if (!Utils.isBlank(name)) {
        queryConditionList.push('name LIKE :name');
      }
      if (!Utils.isBlank(type)) {
        if (Array.isArray(type)) {
          queryConditionList.push('type IN (:type)');
        } else {
          queryConditionList.push('type = type');
        }
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');
      const ret = await this.permissionRepository
        .createQueryBuilder('p')
        .select(['p.*'])
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(*)')
              .from(Permission, 'subP')
              .where('subP.parentId = p.id'),
          'hasChildren',
        )
        .where(queryCondition, {
          name: `%${name}%`,
          type: type,
          status: status,
        })
        .orderBy({
          status: 'DESC',
          sort: 'ASC',
          createTime: 'DESC',
        })
        .getRawMany();

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchPermissionDto: SearchPermissionDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { parentId, kinship, name, type, status } = searchPermissionDto;

      kinship = kinship ? kinship : 0;

      const queryConditionList = [];
      let parentIds = null;
      if (!Utils.isBlank(parentId)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (parseInt(kinship) === 0) {
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
      if (!Utils.isBlank(type)) {
        if (Array.isArray(type)) {
          queryConditionList.push('type IN (:type)');
        } else {
          queryConditionList.push('type = type');
        }
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.permissionRepository
        .createQueryBuilder('p')
        .select(['p.*'])
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COUNT(*)')
              .from(Permission, 'subP')
              .where('subP.parentId = p.id'),
          'hasChildren',
        )
        .where(queryCondition, {
          parentIds: parentIds,
          name: `%${name}%`,
          type: type,
          status: status,
        })
        .orderBy({
          status: 'DESC',
          sort: 'ASC',
          createTime: 'DESC',
        })
        .getRawMany();

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitPermissionDto: LimitPermissionDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, parentId, name, status } = limitPermissionDto;

      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      let parentIds = [];
      if (!Utils.isBlank(parentId)) {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        if (Utils.isArray(parentIds) && parentIds.length > 0) {
          queryConditionList.push('parentId IN (:parentIds)');
        }
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
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.permissionRepository
        .createQueryBuilder()
        .where(queryCondition, {
          parentIds: parentIds,
          name: `%${name}%`,
          status: status,
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
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    try {
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
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<Permission[]> {
    try {
      const { parentId } = baseFindByPIdDto;

      if (Utils.isBlank(parentId)) {
        const ret = await this.permissionRepository.find({
          deleteStatus: 0,
        });
        return Utils.construct(ret, {
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
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    try {
      const { id } = baseFindByIdDto;
      return await this.permissionRepository.findOne(id);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（用户 id，复杂模式）
   */
  async selectPByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      // User -> UserGroup -> Group -> GroupRole -> Role -> RolePermission -> Permission
      const userGroupRolePermission = await this.permissionRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
        .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
        .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
        .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
        .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
        .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
        .where(
          'u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0 AND u.status = 1 AND g.status = 1  AND r.status = 1 AND p.status = 1',
          {
            id: id,
          },
        )
        .getMany();

      // User -> UserRole -> Role -> RolePermission -> Permission
      const userRolePermission = await this.permissionRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
        .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
        .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
        .innerJoinAndSelect(User, 'u', 'u.id = ur.userId')
        .where(
          'u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0 AND u.status = 1 AND r.status = 1 AND p.status = 1',
          {
            id: id,
          },
        )
        .getMany();

      // User -> UserGroup -> Group -> GroupPermission -> Permission
      // const userGroupPermission = await this.permissionRepository
      //   .createQueryBuilder('p')
      //   .innerJoinAndSelect(GroupPermission, 'gp', 'p.id = gp.permissionId')
      //   .innerJoinAndSelect(Group, 'g', 'gp.groupId = g.id')
      //   .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      //   .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      //   .where(
      //     'u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND p.deleteStatus = 0 AND u.status = 1 AND g.status = 1 AND p.status = 1',
      //     {
      //       id: id,
      //     },
      //   )
      //   .getMany();

      // User -> UserPermission -> Permission
      // const userPermission = await this.permissionRepository
      //   .createQueryBuilder('p')
      //   .innerJoinAndSelect(UserPermission, 'up', 'p.id = up.permissionId')
      //   .innerJoinAndSelect(User, 'u', 'u.id = up.userId')
      //   .where(
      //     'u.id = :id AND u.deleteStatus = 0 AND p.deleteStatus = 0 AND u.status = 1 AND p.status = 1',
      //     {
      //       id: id,
      //     },
      //   )
      //   .getMany();

      const ret = Utils.uniqBy(
        Utils.concat(userGroupRolePermission, userRolePermission),
        'id',
      );

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（用户 id，简易模式）
   */
  // async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
  //   try {
  //     const { id } = baseFindByIdDto;
  //     // User -> UserGroup -> Group -> GroupRole -> Role -> RolePermission -> Permission
  //     const userGroupRolePermission = await this.permissionRepository
  //       .createQueryBuilder('p')
  //       .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
  //       .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
  //       .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
  //       .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
  //       .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
  //       .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
  //       .where(
  //         'u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0 AND u.status = 1 AND g.status = 1  AND r.status = 1 AND p.status = 1',
  //         {
  //           id: id,
  //         },
  //       )
  //       .getMany();
  //
  //     return userGroupRolePermission;
  //   } catch (e) {
  //     throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
  //   }
  // }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.permissionRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取是否有子分类（主键 id）
   */
  async isExistChildrenById(baseFindByIdDto: BaseFindByIdDto): Promise<boolean> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.permissionRepository.findOne({ parentId: id, deleteStatus: 0 });
      if (ret) return true;
      else return false;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updatePermissionDto: UpdatePermissionDto, curUser?) {
    try {
      const { id, parentId, ...result } = updatePermissionDto;

      let permission = new Permission();
      permission = Utils.dto2entity(updatePermissionDto, permission);
      if (curUser) {
        permission.updateBy = curUser!.id;
      }
      return await this.permissionRepository.update(id, permission);
    } catch (e) {
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
      const ret = this.permissionRepository
        .createQueryBuilder()
        .update(Permission)
        .set({ status: status, updateBy: curUser ? curUser!.id : null })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.isExistChildrenById(baseFindByIdDto);
      if (ret) {
        throw new ApiException('存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
      }

      await this.permissionRepository
        .createQueryBuilder()
        .update(Permission)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
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

      for (const id of ids) {
        const ret = await this.isExistChildrenById({ id });
        if (ret) {
          throw new ApiException('存在子分类，不允许删除！', ApiErrorCode.NOT_ACTION, HttpStatus.OK);
        }
      }

      await this.permissionRepository
        .createQueryBuilder()
        .update(Permission)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
