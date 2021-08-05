import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { SearchRoleDto } from './dto/search-role.dto';
import { LimitRoleDto } from './dto/limit-role.dto';
import { PermissionService } from '../permission/permission.service';

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
  async insert(createRoleDto: CreateRoleDto, curUser): Promise<CreateRoleDto> {
    let role = new Role();
    role = Utils.dto2entity(createRoleDto, role);
    role.createBy = curUser!.id;
    return await this.roleRepository.save(role);
  }

  /**
   * 获取列表
   */
  async selectList(searchRoleDto: SearchRoleDto): Promise<any[]> {
    const { name } = searchRoleDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.roleRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();
    ;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitRoleDto: LimitRoleDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name } = limitRoleDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.roleRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'createTime': 'DESC' })
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

    const ret = await this.roleRepository.findOne(id, {
      relations: ['rolePermissions'],
    });
    if (!ret) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    if (ret?.rolePermissions) {
      const ids = ret.rolePermissions.map(v => v.id);

      const rolePermissionRet = await this.rolePermissionService.selectByRoleIds({
        ids: ids.join(','),
      });

      // @ts-ignore
      ret.rolePermissions = rolePermissionRet.map(v => {
        return v.permission;
      });
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
   * 修改
   */
  async update(updateRoleDto: UpdateRoleDto, curUser): Promise<void> {
    const { id } = updateRoleDto;

    let role = new Role();
    role = Utils.dto2entity(updateRoleDto, role);
    role.updateBy = curUser!.id;

    await this.roleRepository.update(id, role);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.roleRepository.createQueryBuilder()
      .update(Role)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.roleRepository.createQueryBuilder()
      .update(Role)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 获取权限
   */
  async selectPermissionsByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    const { id } = baseFindByIdDto;
    const ret = await this.roleRepository.findOne({
      relations: ['rolePermissions'],
      where: {
        id: id,
      },
    });

    return ret;
  }

  /**
   * 绑定权限
   */
  async bindPermissions(bindRolePermissionDto: BindRolePermissionDto): Promise<void> {
    const { id, permissions } = bindRolePermissionDto;

    const roleRet = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });

    const rolePermissions = [];
    for (const item of permissions) {
      const permissionRet = await this.permissionService.selectById({ id: item });
      const rolePermission = new RolePermission();
      rolePermission.role = roleRet;
      rolePermission.permission = permissionRet;

      rolePermissions.push(rolePermission);
    }

    const deleteRet = await this.rolePermissionService.deleteByRoleId(id);
    if (!deleteRet) {
      throw new BadRequestException('操作异常！');
    }

    const ret = await this.rolePermissionService.insertBatch(rolePermissions);

    if (ret) {
      return null;
    } else {
      throw new BadRequestException('操作异常！');
    }
  }
}
