import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { GroupRoleService } from '../group-role/group-role.service';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';
import { LimitGroupDto } from './dto/limit-group.dto';
import { RoleService } from '../role/role.service';
import { User } from '../user/entities/user.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { ApiException } from '../../common/exception/api-exception';
import { PermissionService } from '../permission/permission.service';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly groupRoleService: GroupRoleService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createGroupDto: CreateGroupDto, curUser?): Promise<CreateGroupDto> {
    try {
      let group = new Group();
      group = Utils.dto2entity(createGroupDto, group);
      if (curUser) {
        group.createBy = curUser!.id;
      }
      return await this.groupRepository.save(group);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { name, status } = query;

      const queryConditionList = [];
      if (!Utils.isBlank(name)) {
        queryConditionList.push('name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      return await this.groupRepository
        .createQueryBuilder()
        .where(queryCondition, {
          name: `%${name}%`,
          status: status,
        })
        .orderBy({
          status: 'DESC',
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
  async selectListPage(limitGroupDto: LimitGroupDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, name, status } = limitGroupDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(name)) {
        queryConditionList.push('group.name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('group.status IN (:status)');
      }
      queryConditionList.push('group.deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupRoles', 'groupRoles')
        .where(queryCondition, {
          name: `%${name}%`,
          status: status,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          'group.status': 'DESC',
          'group.createTime': 'DESC',
        })
        .getManyAndCount();

      for (const v of ret[0]) {
        if (v?.groupRoles?.length > 0) {
          const ids = v.groupRoles.map(v => v.id);

          const groupRoleRet = await this.groupRoleService.selectByIds(ids);
          v['roles'] = groupRoleRet.filter(v => v.role).map((v) => v.role);
        } else {
          v['roles'] = [];
        }
      }

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      console.log(e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（关联信息，主键 id）
   */
  async selectInfoById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.groupRepository.findOne({
        relations: ['groupRoles', 'groupPermissions'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      if (ret?.groupRoles?.length > 0) {
        const ids = ret.groupRoles.map((v) => v.id);

        const groupRoleRet = await this.groupRoleService.selectByIds(ids);
        const roles = groupRoleRet.filter(v => v.role).map((v) => v.role);
        ret['roles'] = roles;
      } else {
        ret['roles'] = [];
      }

      // if (ret?.groupPermissions?.length > 0) {
      //   const ids = ret.groupPermissions.map((v) => v.id);
      //
      //   const groupPermissionsRet = await this.groupPermissionService.selectByIds(ids);
      //   const permissions = groupPermissionsRet.filter(v => v.permission).map((v) => v.permission);
      //   ret['permissions'] = permissions;
      // } else {
      //   ret['permissions'] = [];
      // }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.groupRepository.findOne({
        relations: ['groupRoles', 'groupPermissions'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 ids）
   */
  async selectByIds(ids: string[]): Promise<Group[]> {
    try {
      const ret = await this.groupRepository.find({
        where: {
          id: In(ids),
        },
      });
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色（用户 id）
   */
  async selectGByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      // User -> UserGroup -> Group
      const userGroup = await this.groupRepository
        .createQueryBuilder('g')
        .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
        .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
        .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0', {
          id: id,
        })
        .getMany();

      return userGroup;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.groupRepository.findOne(id);
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
   * 修改
   */
  async update(updateGroupDto: UpdateGroupDto, curUser?): Promise<void> {
    try {
      const { id } = updateGroupDto;

      let group = new Group();
      group = Utils.dto2entity(updateGroupDto, group);
      if (curUser) {
        group.updateBy = curUser!.id;
      }
      await this.groupRepository.update(id, group);
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
      const ret = this.groupRepository
        .createQueryBuilder()
        .update(Group)
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

      await this.groupRepository
        .createQueryBuilder()
        .update(Group)
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
      await this.groupRepository
        .createQueryBuilder()
        .update(Group)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindGroupRoleDto: BindGroupRoleDto): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { id, roles } = bindGroupRoleDto;

      if (roles && !Utils.isArray(roles)) {
        roles = Utils.split(',');
      }

      const groupRet = await this.groupRepository.findOne({
        where: {
          id: id,
        },
      });

      const groupRoles = [];
      for (const item of roles) {
        const roleRet = await this.roleService.selectById({ id: item });
        const groupRole = new GroupRole();
        groupRole.group = groupRet;
        groupRole.role = roleRet;
        groupRoles.push(groupRole);
      }

      const deleteRet = await this.groupRoleService.deleteByGroupId(id);
      if (!deleteRet) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.groupRoleService.insertBatch(groupRoles);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色
   */
  async selectRolesById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.groupRepository.findOne({
        relations: ['groupRoles'],
        where: {
          id: id,
        },
      });

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定权限
   */
  // async bindPermissions(bindGroupPermissionDto: BindGroupPermissionDto): Promise<void> {
  //   try {
  //     // eslint-disable-next-line prefer-const
  //     let { id, permissions } = bindGroupPermissionDto;
  //
  //     if (permissions && !Utils.isArray(permissions)) {
  //       permissions = Utils.split(',');
  //     }
  //
  //     const groupRet = await this.groupRepository.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });
  //
  //     const groupPermissions = [];
  //     for (const item of permissions) {
  //       const permissionRet = await this.permissionService.selectById({ id: item });
  //       const groupPermission = new GroupPermission();
  //       groupPermission.group = groupRet;
  //       groupPermission.permission = permissionRet;
  //
  //       groupPermissions.push(groupPermission);
  //     }
  //
  //     const deleteRet = await this.groupPermissionService.deleteByGroupId(id);
  //     if (!deleteRet) {
  //       throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
  //     }
  //
  //     const ret = await this.groupPermissionService.insertBatch(groupPermissions);
  //
  //     if (ret) {
  //       return null;
  //     } else {
  //       throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
  //     }
  //   } catch (e) {
  //     throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
  //   }
  // }

  /**
   * 获取权限
   */
  // async selectPermissionsById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
  //   try {
  //     const { id } = baseFindByIdDto;
  //     const ret = await this.groupRepository.findOne({
  //       relations: ['groupPermissions'],
  //       where: {
  //         id: id,
  //       },
  //     });
  //
  //     return ret;
  //   } catch (e) {
  //     throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
  //   }
  // }
}
