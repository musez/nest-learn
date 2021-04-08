import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { BaseFindByIdDto } from '../base.dto';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { CreateRolePermissionDto } from '../role-permission/dto/create-role-permission.dto';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { SearchRoleDto } from './dto/search-role.dto';
import { LimitRoleDto } from './dto/limit-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly rolePermissionService: RolePermissionService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createRoleDto: CreateRoleDto, curUser?): Promise<CreateRoleDto> {
    let role = new Role();
    role = Utils.dto2entity(createRoleDto, role);
    role.createBy = curUser.id;
    return await this.roleRepository.save(role);
  }

  /**
   * 获取列表
   */
  async selectList(searchRoleDto: SearchRoleDto): Promise<Role[]> {
    let { name } = searchRoleDto;

    let queryConditionList = [];

    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }

    let queryCondition = queryConditionList.join(' AND ');

    return await this.roleRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .orderBy('createTime', 'DESC')
      .getMany();
    ;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitRoleDto: LimitRoleDto): Promise<any> {
    let { page, limit, name } = limitRoleDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.roleRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'DESC')
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
    let { id } = baseFindByIdDto;
    return await this.roleRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.roleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateRoleDto: UpdateRoleDto, curUser?): Promise<void> {
    let { id } = updateRoleDto;

    let role = new Role();
    role = Utils.dto2entity(updateRoleDto, role);
    role.updateBy = curUser.id;

    await this.roleRepository.update(id, role);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    await this.roleRepository.createQueryBuilder()
      .delete()
      .from(Role)
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 获取权限
   */
  async selectPermissionsByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<RolePermission[]> {
    return await this.rolePermissionService.selectByRoleId(baseFindByIdDto);
  }

  /**
   * 绑定权限
   */
  async bindPermissions(bindRolePermissionDto: BindRolePermissionDto): Promise<void> {
    let { id, permissions } = bindRolePermissionDto;

    let userGroupList = [];
    for (let i = 0, len = permissions.length; i < len; i++) {
      let createRolePermissionDto = new CreateRolePermissionDto();
      createRolePermissionDto.roleId = id;
      createRolePermissionDto.permissionId = permissions[i];
      userGroupList.push(createRolePermissionDto);
    }

    await this.rolePermissionService.deleteByRoleId(id);
    await this.rolePermissionService.insertBatch(userGroupList);
  }
}
