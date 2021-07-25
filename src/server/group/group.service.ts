import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
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

  /**
   * 添加
   */
  async insert(createGroupDto: CreateGroupDto, curUser): Promise<CreateGroupDto> {
    let group = new Group();
    group = Utils.dto2entity(createGroupDto, group);
    group.createBy = curUser!.id;
    return await this.groupRepository.save(group);
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    const { name } = query;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.groupRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitGroupDto: LimitGroupDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name } = limitGroupDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.groupRepository.createQueryBuilder()
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    return await this.groupRepository.findOne(baseFindByIdDto);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.groupRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateGroupDto: UpdateGroupDto, curUser): Promise<void> {
    const { id } = updateGroupDto;

    let group = new Group();
    group = Utils.dto2entity(updateGroupDto, group);
    group.updateBy = curUser!.id;
    await this.groupRepository.update(id, group);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.groupRepository.createQueryBuilder()
      .update(Group)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.groupRepository.createQueryBuilder()
      .update(Group)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 获取角色
   */
  async selectRolesByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupRole[]> {
    return await this.groupRoleService.selectByGroupId(baseFindByIdDto);
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindGroupRoleDto: BindGroupRoleDto): Promise<void> {
    const { id, roles } = bindGroupRoleDto;

    const userGroupList = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      const createGroupRoleDto = new CreateGroupRoleDto();
      createGroupRoleDto.groupId = id;
      createGroupRoleDto.roleId = roles[i];
      userGroupList.push(createGroupRoleDto);
    }

    await this.groupRoleService.deleteByGroupId(id);
    await this.groupRoleService.insertBatch(userGroupList);
  }
}
