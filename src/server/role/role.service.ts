import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class RoleService {
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
    let role = new Role();
    role = Utils.dto2entity(createRoleDto, role);
    if (curUser) {
      role.createBy = curUser!.id;
    }
    return await this.roleRepository.save(role);
  }

  /**
   * 获取列表
   */
  async selectList(searchRoleDto: SearchRoleDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { name, status } = searchRoleDto;

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
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitRoleDto: LimitRoleDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, status } = limitRoleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

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

    const res = await this.roleRepository
      .createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        status: 'DESC',
        createTime: 'DESC',
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
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    const { id } = baseFindByIdDto;

    const ret = await this.roleRepository.findOne({
      relations: ['rolePermissions'],
      where: {
        id: id,
      },
    });
    if (!ret) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }
    if (ret?.rolePermissions?.length > 0) {
      const ids = ret.rolePermissions.map((v) => v.id);

      const rolePermissionRet = await this.rolePermissionService.selectByRoleIds(ids);
      const rolePermissions = rolePermissionRet.filter(v => v.permission).map((v) => {
        return v.permission;
      });
      // @ts-ignore
      ret.rolePermissions = Utils.uniqBy(rolePermissions, 'id');
    }

    return ret;
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.roleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 获取角色（用户 id）
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const userGroupRole = await this.roleRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
      .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      .where(
        'u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0',
        {
          id: id,
        },
      )
      .getMany();

    const userRole = await this.roleRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
      .innerJoinAndSelect(User, 'u', 'u.id = ur.userId')
      .where('u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0', {
        id: id,
      })
      .getMany();

    return Utils.uniqBy(Utils.concat(userGroupRole, userRole), 'id');
  }

  /**
   * 修改
   */
  async update(updateRoleDto: UpdateRoleDto, curUser?): Promise<void> {
    const { id } = updateRoleDto;

    let role = new Role();
    role = Utils.dto2entity(updateRoleDto, role);
    if (curUser) {
      role.updateBy = curUser!.id;
    }

    await this.roleRepository.update(id, role);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?,): Promise<any> {
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
      throw new ApiException('更新异常！', 500);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.roleRepository
      .createQueryBuilder()
      .update(Role)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null , deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(
    baseFindByIdsDto: BaseFindByIdsDto,
    curUser,
  ): Promise<void> {
     let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    await this.roleRepository
      .createQueryBuilder()
      .update(Role)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null , deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 绑定权限
   */
  async bindPermissions(
    bindRolePermissionDto: BindRolePermissionDto,
  ): Promise<void> {
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
      throw new ApiException('操作异常！', 500);
    }

    const ret = await this.rolePermissionService.insertBatch(rolePermissions);

    if (ret) {
      return null;
    } else {
      throw new ApiException('操作异常！', 500);
    }
  }

  /**
   * 获取权限
   */
  async selectPermissionsByRoleId(baseFindByIdDto: BaseFindByIdDto,): Promise<Role> {
    const { id } = baseFindByIdDto;
    const ret = await this.roleRepository.findOne({
      relations: ['rolePermissions'],
      where: {
        id: id,
      },
    });

    return ret;
  }
}
