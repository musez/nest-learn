import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { BaseFindByIdDto } from '../base.dto';
import { BindUserGroupDto } from '../user/dto/bind-user-group.dto';
import { CreateUserGroupDto } from '../user-group/dto/create-user-group.dto';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { GroupRoleService } from '../group-role/group-role.service';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';
import { CreateGroupRoleDto } from '../group-role/dto/create-group-role.dto';
import { LimitGroupDto } from './dto/limit-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly groupRoleService: GroupRoleService,
  ) {
  }

  async insert(createGroupDto: CreateGroupDto, curUser?): Promise<CreateGroupDto> {
    let group = new Group();
    group = Utils.dto2entity(createGroupDto, group);
    group.createBy = curUser.id;
    return await this.groupRepository.save(group);
  }

  async selectList(query): Promise<Group[]> {
    let { name } = query;

    if (Utils.isNil(name)) {
      name = '';
    }

    return await this.groupRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async selectListPage(limitGroupDto: LimitGroupDto): Promise<any> {
    let { page, limit, name } = limitGroupDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isNil(name)) {
      name = '';
    }

    let res = await this.groupRepository.createQueryBuilder()
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'ASC')
      .where('name like :name', { name: `%${name}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    return await this.groupRepository.findOne(baseFindByIdDto);
  }

  async update(updateGroupDto: UpdateGroupDto, curUser?): Promise<void> {
    let { id } = updateGroupDto;
    let isExist = await this.groupRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let group = new Group();
    group = Utils.dto2entity(updateGroupDto, group);
    group.updateBy = curUser.id;

    await this.groupRepository.save(group);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.groupRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${baseFindByIdDto} 不存在！`);
    }

    await this.groupRepository.remove(isExist);
  }

  async selectRolesByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupRole[]> {
    let isExist = await this.groupRepository.findOne(baseFindByIdDto);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${baseFindByIdDto} 不存在！`);
    }

    return await this.groupRoleService.selectByGroupId(baseFindByIdDto);
  }

  async bindRoles(bindGroupRoleDto: BindGroupRoleDto): Promise<void> {
    let { id, roles } = bindGroupRoleDto;
    let isExist = await this.groupRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let userGroupList = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      let createGroupRoleDto = new CreateGroupRoleDto();
      createGroupRoleDto.groupId = id;
      createGroupRoleDto.roleId = roles[i].id;
      userGroupList.push(createGroupRoleDto);
    }

    await this.groupRoleService.insert(userGroupList);
  }
}
