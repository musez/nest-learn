import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as crypto from 'crypto';
import { Utils } from './../../utils/index';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { BaseFindByIdDto } from '../base.dto';
import { BindUserGroupDto } from './dto/bind-user-group.dto';
import { UserGroupService } from '../user-group/user-group.service';
import { CreateGroupRoleDto } from '../group-role/dto/create-group-role.dto';
import { CreateUserGroupDto } from '../user-group/dto/create-user-group.dto';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { BindUserRoleDto } from '../user-role/dto/bind-user-role.dto';
import { CreateUserRoleDto } from '../user-role/dto/create-user-role.dto';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserRoleService } from '../user-role/user-role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userGroupService: UserGroupService,
    private readonly userRoleService: UserRoleService,
  ) {
  }

  async selectByName(userName: string): Promise<User | undefined> {
    const user = this.userRepository.findOne({ userName: userName });
    if (user) return user;
    else return null;
  }

  async incrementLoginCount(id: string): Promise<any> {
    let isExist = await this.userRepository.findOne(id, {
      select: ['id'],
    });
    if (!isExist) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    return await this.userRepository.increment(isExist, 'loginCount', 1);
  }

  async insert(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    let { userName } = createUserDto;

    let isExist = await this.userRepository.findOne({ userName: userName });
    if (isExist) {
      throw new BadRequestException(`用户名 ${userName} 已存在！`);
    }

    let user = new User();
    for (let key in createUserDto) {
      if (!Utils.isEmpty(createUserDto[key])) {
        if (key === 'userPwd') {
          user.userPwd = crypto.createHmac('sha256', '888888').digest('hex');
        } else {
          user[key] = createUserDto[key];
        }
      }
    }

    let userinfo = new Userinfo();
    for (let key in createUserDto) {
      if (!Utils.isEmpty(createUserDto[key])) {
        userinfo[key] = createUserDto[key];
      }
    }

    user.userinfo = userinfo;

    return await this.userRepository.save(user);
  }

  async selectList(query): Promise<User[]> {
    let { userName } = query;

    if (Utils.isEmpty(userName)) {
      userName = '';
    }

    return await this.userRepository.find({
      relations: ['userinfo'],
      where: {
        userName: Like(`%${userName}%`),
      },
    });
  }

  async selectListPage(query): Promise<any> {
    let { page, limit, userName, mobile } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    if (userName) {
      queryConditionList.push('user.userName like :userName');
    }
    if (mobile) {
      queryConditionList.push('user.mobile = :mobile');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.userinfo', 'userinfo')
      .where(queryCondition, {
        userName: `%${userName}%`,
        mobile: mobile,
      })
      .skip(offset)
      .take(limit)
      .orderBy('user.createTime', 'ASC')
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    let { id } = baseFindByIdDto;
    return await this.userRepository.findOne(id, { relations: ['userinfo'] });
  }

  async update(updateUserDto: UpdateUserDto): Promise<void> {
    let { id } = updateUserDto;

    let isExist = await this.userRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let user = new User();
    for (let key in updateUserDto) {
      if (!Utils.isEmpty(updateUserDto[key])) {
        if (key === 'userPwd') {
          // user.userPwd = crypto.createHmac('sha256', updateUserDto.userPwd).digest('hex');
        } else {
          user[key] = updateUserDto[key];
        }
      }
    }

    let userinfo = new Userinfo();
    for (let key in updateUserDto) {
      if (!Utils.isEmpty(updateUserDto[key])) {
        userinfo[key] = updateUserDto[key];
      }
    }

    user.userinfo = userinfo;
    // await this.userRepository.update({ id: id }, updateUserDto);
    await this.userRepository.save(updateUserDto);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.userRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    await this.userRepository.remove(isExist);
  }

  async bindGroups(bindUserGroupDto: BindUserGroupDto): Promise<void> {
    let { id, groups } = bindUserGroupDto;
    let isExist = await this.userRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let userGroupList = [];
    for (let i = 0, len = groups.length; i < len; i++) {
      let createUserGroupDto = new CreateUserGroupDto();
      createUserGroupDto.userId = id;
      createUserGroupDto.groupId = groups[i].id;
      userGroupList.push(createUserGroupDto);
    }

    await this.userGroupService.insert(userGroupList);
  }

  async selectGroupsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    let isExist = await this.userRepository.findOne(baseFindByIdDto);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${baseFindByIdDto} 不存在！`);
    }

    return await this.userGroupService.selectByUserId(baseFindByIdDto);
  }

  async bindRoles(bindUserRoleDto: BindUserRoleDto): Promise<void> {
    let { id, roles } = bindUserRoleDto;
    let isExist = await this.userRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let userGroupList = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      let createUserRoleDto = new CreateUserRoleDto();
      createUserRoleDto.userId = id;
      createUserRoleDto.roleId = roles[i].id;
      userGroupList.push(createUserRoleDto);
    }

    await this.userRoleService.insert(userGroupList);
  }

  async selectRolesByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    let isExist = await this.userRepository.findOne(baseFindByIdDto);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${baseFindByIdDto} 不存在！`);
    }

    return await this.userRoleService.selectByUserId(baseFindByIdDto);
  }

  async selectPermissionsByUserId(id: string): Promise<any> {
    let isExist = await this.userRepository.findOne(id);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id ${id} 不存在！`);
    }

    let res1 = await this.userRepository.query(`
        select p.* from cms_nest.permission p
        inner join cms_nest.role_permission rp on p.id = rp.permissionId
        inner join cms_nest.role r on rp.roleId = r.id
        inner join cms_nest.group_role gr on r.id = gr.roleId
        inner join cms_nest.group g on gr.groupId = g.id
        inner join cms_nest.user_group ug on g.id = ug.groupId
        inner join cms_nest.user u on u.id = ug.userId
        where u.id = '${id}'
        `);

    let res2 = await this.userRepository.query(`
        select p.*
        from cms_nest.permission p
        inner join cms_nest.role_permission rp on p.id = rp.permissionId
        inner join cms_nest.role r on rp.roleId = r.id
        inner join cms_nest.user_role ur on r.id = ur.roleId
        inner join cms_nest.user u on u.id = ur.userId
        where u.id = '${id}'
        `);

    let res = Utils.assign(isExist, {
      permission: Utils.uniqBy(Utils.concat(res1, res2), 'id'),
    });

    return res;
  }
}
