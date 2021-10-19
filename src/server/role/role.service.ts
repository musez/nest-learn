import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { SearchRoleDto } from './dto/search-role.dto';
import { LimitRoleDto } from './dto/limit-role.dto';
import { PermissionService } from '../permission/permission.service';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { Group } from '../group/entities/group.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createRoleDto: CreateRoleDto, curUser?): Promise<CreateRoleDto> {
    try {
      let role = new Role();
      role = Utils.dto2entity(createRoleDto, role);
      if (curUser) {
        role.createBy = curUser!.id;
      }
      return await this.roleRepository.save(role);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchRoleDto: SearchRoleDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { name, status } = searchRoleDto;

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

      return await this.roleRepository
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
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitRoleDto: LimitRoleDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, name, status } = limitRoleDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(name)) {
        queryConditionList.push('role.name LIKE :name');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('role.status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
        .where(queryCondition, {
          name: `%${name}%`,
          status: status,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          'role.status': 'DESC',
          'role.createTime': 'DESC',
        })
        .getManyAndCount();

      for (const v of ret[0]) {
        if (v?.rolePermissions?.length > 0) {
          const ids = v.rolePermissions.map(v => v.permissionId);
          const permissionRet = await this.permissionService.selectByIds(ids);
          v['permissions'] = permissionRet;
        } else {
          v['permissions'] = [];
        }
      }

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（关联信息，主键 id）
   */
  async selectInfoById(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.roleRepository.findOne({
        relations: ['rolePermissions'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      if (ret?.rolePermissions?.length > 0) {
        const ids = ret.rolePermissions.map(v => v.permissionId);
        const permissionRet = await this.permissionService.selectByIds(ids);
        ret['permissions'] = permissionRet;
      } else {
        ret['permissions'] = [];
      }

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.roleRepository.findOne({
        relations: ['rolePermissions'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 ids）
   */
  async selectByIds(ids: string[]): Promise<Role[]> {
    try {
      const ret = await this.roleRepository.find({
        relations: ['rolePermissions'],
        where: {
          id: In(ids),
        },
      });
      return ret;
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
      const isExist = await this.roleRepository.findOne(id);
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
   * 获取角色（用户 id，复杂模式）
   */
  async selectRByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      // User -> UserGroup -> Group -> GroupRole -> Role
      const userGroupRole = await this.roleRepository
        .createQueryBuilder('r')
        .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
        .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
        .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
        .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
        .where(
          'u.id = :id',
          {
            id: id,
          },
        )
        .getMany();

      // User -> UserRole -> Role
      const userRole = await this.roleRepository
        .createQueryBuilder('r')
        .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
        .innerJoinAndSelect(User, 'u', 'u.id = ur.userId')
        .where('u.id = :id', {
          id: id,
        })
        .getMany();

      return Utils.uniqBy(Utils.concat(userGroupRole, userRole), 'id');
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色（用户 id，简易模式）
   */
  // async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
  //   try {
  //     const { id } = baseFindByIdDto;
  //     // User -> UserGroup -> Group -> GroupRole -> Role
  //     const userGroupRole = await this.roleRepository
  //       .createQueryBuilder('r')
  //       .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
  //       .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
  //       .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
  //       .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
  //       .where(
  //         'u.id = :id',
  //         {
  //           id: id,
  //         },
  //       )
  //       .getMany();
  //
  //     return userGroupRole;
  //   } catch (e) {
  //     this.logger.error('系统异常：', e);
  //     throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
  //   }
  // }

  /**
   * 修改
   */
  async update(updateRoleDto: UpdateRoleDto, curUser?): Promise<void> {
    try {
      const { id } = updateRoleDto;

      let role = new Role();
      role = Utils.dto2entity(updateRoleDto, role);
      if (curUser) {
        role.updateBy = curUser!.id;
      }

      await this.roleRepository.update(id, role);
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
      const ret = this.roleRepository
        .createQueryBuilder()
        .update(Role)
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
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      await this.roleRepository
        .createQueryBuilder()
        .delete()
        .from(Role)
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
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      await this.roleRepository
        .createQueryBuilder()
        .delete()
        .from(Role)
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定权限
   */
  async bindPermissions(bindRolePermissionDto: BindRolePermissionDto): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { id, permissions } = bindRolePermissionDto;

      if (permissions && !Utils.isArray(permissions)) {
        permissions = Utils.split(',');
      }

      const roleRet = await this.roleRepository.findOne({
        where: {
          id: id,
        },
      });

      const rolePermissions = [];
      for (const item of permissions) {
        const permissionRet = await this.permissionService.selectById({
          id: item,
        });
        const rolePermission = new RolePermission();
        rolePermission.role = roleRet;
        rolePermission.permission = permissionRet;

        rolePermissions.push(rolePermission);
      }

      const deleteRet = await this.rolePermissionService.deleteByRoleId(id);
      if (!deleteRet) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.rolePermissionService.insertBatch(rolePermissions);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限
   */
  async selectPermissionsById(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.roleRepository.findOne({
        relations: ['rolePermissions'],
        where: {
          id: id,
        },
      });

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
