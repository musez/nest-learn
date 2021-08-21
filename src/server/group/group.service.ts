import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly roleService: RoleService,
    private readonly groupRoleService: GroupRoleService,
  ) {
  }

  /**
   * 添加
   */
  async insert(
    createGroupDto: CreateGroupDto,
    curUser,
  ): Promise<CreateGroupDto> {
    let group = new Group();
    group = Utils.dto2entity(createGroupDto, group);
    group.createBy = curUser!.id;
    return await this.groupRepository.save(group);
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    const { name, status } = query;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
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
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitGroupDto: LimitGroupDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, status } = limitGroupDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.groupRepository
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    const { id } = baseFindByIdDto;
    const ret = await this.groupRepository.findOne({
      relations: ['groupRoles'],
      where: {
        id: id,
      },
    });
    if (!ret) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }
    if (ret?.groupRoles?.length > 0) {
      const ids = ret.groupRoles.map((v) => v.id);

      const groupRoleRet = await this.groupRoleService.selectByGroupIds({
        ids: ids.join(','),
      });

      // @ts-ignore
      ret.groupRoles = groupRoleRet.map((v) => {
        return v.role;
      });
    }
    return ret;
  }

  /**
   * 获取角色（用户 id）
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const userGroup = await this.groupRepository
      .createQueryBuilder('g')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0', {
        id: id,
      })
      .getMany();

    return userGroup;
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
   * 修改状态
   */
  async updateStatus(
    baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto,
    curUser,
  ): Promise<any> {
    const { ids, status } = baseModifyStatusByIdsDto;

    const ret = this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set({ status: status, updateBy: curUser!.id })
      .where('id in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', 500);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
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
    const { ids } = baseFindByIdsDto;

    await this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 获取角色
   */
  async selectRolesByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    const { id } = baseFindByIdDto;
    const ret = await this.groupRepository.findOne({
      relations: ['groupRoles'],
      where: {
        id: id,
      },
    });

    return ret;
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindGroupRoleDto: BindGroupRoleDto): Promise<void> {
    const { id, roles } = bindGroupRoleDto;

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
      throw new ApiException('操作异常！', 500);
    }

    const ret = await this.groupRoleService.insertBatch(groupRoles);

    if (ret) {
      return null;
    } else {
      throw new ApiException('操作异常！', 500);
    }
  }
}
