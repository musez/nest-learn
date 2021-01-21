import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Group } from '../group/entities/group.entity';
import { Role } from './entities/role.entity';
import { BaseFindByIdDto } from '../base.dto';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { BindUserGroupDto } from '../user/dto/bind-user-group.dto';
import { CreateUserGroupDto } from '../user-group/dto/create-user-group.dto';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';
import { CreateGroupRoleDto } from '../group-role/dto/create-group-role.dto';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { CreateRolePermissionDto } from '../role-permission/dto/create-role-permission.dto';
import { RolePermissionService } from '../role-permission/role-permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly rolePermissionService: RolePermissionService,
  ) {
  }

  async insert(createRoleDto: CreateRoleDto): Promise<CreateRoleDto> {
    return await this.roleRepository.save(createRoleDto);
  }

  async selectList(query): Promise<Role[]> {
    let { name } = query;

    if (Utils.isEmpty(name)) {
      name = '';
    }

    return await this.roleRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async selectListPage(query): Promise<any> {
    let { page, limit, name } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isEmpty(name)) {
      name = '';
    }

    let res = await this.roleRepository.createQueryBuilder('role')
      .skip(offset)
      .take(limit)
      .orderBy('role.createTime', 'ASC')
      .where('role.name like :name', { name: `%${name}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    let { id } = baseFindByIdDto;
    return await this.roleRepository.findOne(id);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<void> {
    let { id } = updateRoleDto;

    let isExist = await this.roleRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let role = new Role();
    Utils.dto2entity(updateRoleDto, role);

    await this.roleRepository.save(updateRoleDto);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.roleRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    await this.roleRepository.remove(isExist);
  }

  async selectPermissionsByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<RolePermission[]> {
    let isExist = await this.roleRepository.findOne(baseFindByIdDto);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${baseFindByIdDto} 不存在！`);
    }

    return await this.rolePermissionService.selectByRoleId(baseFindByIdDto);
  }

  async bindPermissions(bindRolePermissionDto: BindRolePermissionDto): Promise<void> {
    let { id, permissions } = bindRolePermissionDto;
    let isExist = await this.roleRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let userGroupList = [];
    for (let i = 0, len = permissions.length; i < len; i++) {
      let createRolePermissionDto = new CreateRolePermissionDto();
      createRolePermissionDto.roleId = id;
      createRolePermissionDto.permissionId = permissions[i].id;
      userGroupList.push(createRolePermissionDto);
    }

    await this.rolePermissionService.insert(userGroupList);
  }
}
