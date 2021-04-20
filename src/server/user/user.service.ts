import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Utils } from './../../utils/index';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { BindUserGroupDto } from './dto/bind-user-group.dto';
import { UserGroupService } from '../user-group/user-group.service';
import { CreateUserGroupDto } from '../user-group/dto/create-user-group.dto';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { BindUserRoleDto } from '../user-role/dto/bind-user-role.dto';
import { CreateUserRoleDto } from '../user-role/dto/create-user-role.dto';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserRoleService } from '../user-role/user-role.service';
import { UserinfoService } from '../userinfo/userinfo.service';
import { SearchUserDto } from './dto/search-user.dto';
import { LimitUserDto } from './dto/limit-user.dto';
import { CryptoUtil } from '../../utils/crypto.util';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userinfoService: UserinfoService,
    private readonly userGroupService: UserGroupService,
    private readonly userRoleService: UserRoleService,
    private readonly cryptoUtil: CryptoUtil,
  ) {
  }

  /**
   * 获取详情（userName）
   */
  async selectByName(userName: string): Promise<User | undefined> {
    const user = this.userRepository.findOne({
      userName: userName,
      deleteStatus: 0,
    });
    if (user) return user;
    else return null;
  }

  /**
   * 修改登录次数
   */
  async incrementLoginCount(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let userEntity = await this.userRepository.findOne(baseFindByIdDto, {
      select: ['id'],
    });

    return await this.userRepository.increment(userEntity, 'loginCount', 1);
  }

  /**
   * 添加
   */
  async insert(createUserDto: CreateUserDto, curUser?): Promise<CreateUserDto> {
    let { userPwd } = createUserDto;

    let user = new User();
    user = Utils.dto2entity(createUserDto, user);
    if (Utils.isBlank(userPwd)) {
      user.userPwd = this.cryptoUtil.encryptPassword('888888');
    } else {
      user.userPwd = this.cryptoUtil.encryptPassword(userPwd);
    }
    user.createBy = curUser.id;

    let userinfo = new Userinfo();
    if (!Utils.isBlank(createUserDto.provinceId)) {
      userinfo.provinceId = createUserDto.provinceId;
    }
    if (!Utils.isBlank(createUserDto.cityId)) {
      userinfo.cityId = createUserDto.cityId;
    }
    if (!Utils.isBlank(createUserDto.districtId)) {
      userinfo.districtId = createUserDto.districtId;
    }
    if (!Utils.isBlank(createUserDto.address)) {
      userinfo.address = createUserDto.address;
    }
    // userinfo = Utils.dto2entity(createUserDto, userinfo);
    userinfo.user = user;// 联接两者

    await this.userRepository.save(user);
    await this.userinfoService.insert(userinfo);
    return createUserDto;
  }

  /**
   * 获取列表
   */
  async selectList(searchUserDto: SearchUserDto): Promise<any[]> {
    let { userName, name, userType, mobile, email } = searchUserDto;

    let queryConditionList = [];
    if (!Utils.isBlank(userName)) {
      queryConditionList.push('user.userName LIKE :userName');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('user.name LIKE :name');
    }
    if (!Utils.isBlank(userType)) {
      queryConditionList.push('user.userType = :userType');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('user.mobile = :mobile');
    }
    if (!Utils.isBlank(email)) {
      queryConditionList.push('user.email = :email');
    }
    queryConditionList.push('deleteStatus = 0');
    let queryCondition = queryConditionList.join(' AND ');

    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.userinfo', 'userinfo')
      .where(queryCondition, {
        userName: `%${userName}%`,
        name: `%${name}%`,
        userType: userType,
        mobile: mobile,
        email: email,
      })
      .orderBy('user.createTime', 'DESC')
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitUserDto: LimitUserDto): Promise<any> {
    let { page, limit, userName, name, userType, mobile, email } = limitUserDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    if (!Utils.isBlank(userName)) {
      queryConditionList.push('user.userName LIKE :userName');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('user.name LIKE :name');
    }
    if (!Utils.isBlank(userType)) {
      queryConditionList.push('user.userType = :userType');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('user.mobile = :mobile');
    }
    if (!Utils.isBlank(email)) {
      queryConditionList.push('user.email = :email');
    }
    queryConditionList.push('deleteStatus = 0');
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.userinfo', 'userinfo')
      .where(queryCondition, {
        userName: `%${userName}%`,
        name: `%${name}%`,
        userType: userType,
        mobile: mobile,
        email: email,
      })
      .skip(offset)
      .take(limit)
      .orderBy('user.createTime', 'DESC')
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    let { id } = baseFindByIdDto;
    return await this.userRepository.findOne(id, { relations: ['userinfo'] });
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.userRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 是否存在（用户名）
   */
  async isExistUserName(userName: string): Promise<Boolean> {
    let isExist = await this.userRepository.findOne({ userName: userName });
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateUserDto: UpdateUserDto, curUser?): Promise<void> {
    let { id } = updateUserDto;

    let user = new User();
    user = Utils.dto2entity(updateUserDto, user);
    user.updateBy = curUser.id;

    let userinfo = new Userinfo();
    // userinfo = Utils.dto2entity(updateUserDto, userinfo);
    if (!Utils.isBlank(updateUserDto.provinceId)) {
      userinfo.provinceId = updateUserDto.provinceId;
    }
    if (!Utils.isBlank(updateUserDto.cityId)) {
      userinfo.cityId = updateUserDto.cityId;
    }
    if (!Utils.isBlank(updateUserDto.districtId)) {
      userinfo.districtId = updateUserDto.districtId;
    }
    if (!Utils.isBlank(updateUserDto.address)) {
      userinfo.address = updateUserDto.address;
    }
    userinfo.user = user;// 联接两者

    await this.userRepository.update(id, user);
    await this.userinfoService.updateByUserId(id, userinfo);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    let { ids, status } = baseModifyStatusByIdsDto;

    return this.userRepository.createQueryBuilder()
      .update(User)
      .set({ status: status, updateBy: curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    let { id } = baseFindByIdDto;

    // this.userRepository.delete(id);
    // await this.userinfoService.deleteByUserId(id);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser.id })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    // this.userRepository.delete(ids);
    // await this.userinfoService.deleteByUserId(ids);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser.id })
      .where('ids in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 绑定用户组
   */
  async bindGroups(bindUserGroupDto: BindUserGroupDto): Promise<void> {
    let { id, groups } = bindUserGroupDto;

    let userGroupList = [];
    for (let i = 0, len = groups.length; i < len; i++) {
      let createUserGroupDto = new CreateUserGroupDto();
      createUserGroupDto.userId = id;
      createUserGroupDto.groupId = groups[i];
      userGroupList.push(createUserGroupDto);
    }
    await this.userGroupService.deleteByUserId(id);
    await this.userGroupService.insertBatch(userGroupList);
  }

  /**
   * 获取用户组
   */
  async selectGroupsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    return await this.userGroupService.selectByUserId(baseFindByIdDto);
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindUserRoleDto: BindUserRoleDto): Promise<void> {
    let { id, roles } = bindUserRoleDto;

    let userGroupList = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      let createUserRoleDto = new CreateUserRoleDto();
      createUserRoleDto.userId = id;
      createUserRoleDto.roleId = roles[i];
      userGroupList.push(createUserRoleDto);
    }

    await this.userRoleService.deleteByUserId(id);
    await this.userRoleService.insertBatch(userGroupList);
  }

  /**
   * 获取角色
   */
  async selectRolesByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    return await this.userRoleService.selectByUserId(baseFindByIdDto);
  }

  /**
   * 获取用户、用户组、角色、权限
   */
  async selectPermissionsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let userEntity = await this.selectById(baseFindByIdDto);

    let permissions1 = await this.userRepository.query(`
        select p.*
        from cms_nest.sys_permission p
                 inner join cms_nest.sys_role_permission rp on p.id = rp.permissionId
                 inner join cms_nest.sys_role r on rp.roleId = r.id
                 inner join cms_nest.sys_group_role gr on r.id = gr.roleId
                 inner join cms_nest.sys_group g on gr.groupId = g.id
                 inner join cms_nest.sys_user_group ug on g.id = ug.groupId
                 inner join cms_nest.sys_user u on u.id = ug.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let permissions2 = await this.userRepository.query(`
        select p.*
        from cms_nest.sys_permission p
                 inner join cms_nest.sys_role_permission rp on p.id = rp.permissionId
                 inner join cms_nest.sys_role r on rp.roleId = r.id
                 inner join cms_nest.sys_user_role ur on r.id = ur.roleId
                 inner join cms_nest.sys_user u on u.id = ur.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let role1 = await this.userRepository.query(`
        select r.*
        from cms_nest.sys_role r
                 inner join cms_nest.sys_group_role gr on r.id = gr.roleId
                 inner join cms_nest.sys_group g on gr.groupId = g.id
                 inner join cms_nest.sys_user_group ug on g.id = ug.groupId
                 inner join cms_nest.sys_user u on u.id = ug.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let role2 = await this.userRepository.query(`
        select r.*
        from cms_nest.sys_role r
                 inner join cms_nest.sys_user_role ur on r.id = ur.roleId
                 inner join cms_nest.sys_user u on u.id = ur.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let group1 = await this.userRepository.query(`
        select g.*
        from cms_nest.sys_group g
                 inner join cms_nest.sys_user_group ug on g.id = ug.groupId
                 inner join cms_nest.sys_user u on u.id = ug.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let res = Utils.assign(userEntity, {
      permissions: Utils.uniqBy(Utils.concat(permissions1, permissions2), 'id'),
      roles: Utils.uniqBy(Utils.concat(role1, role2), 'id'),
      groups: group1,
    });

    return res;
  }

  /**
   * 获取权限
   */
  async selectAuthByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let permissions1 = await this.userRepository.query(`
        select p.*
        from cms_nest.sys_permission p
                 inner join cms_nest.sys_role_permission rp on p.id = rp.permissionId
                 inner join cms_nest.sys_role r on rp.roleId = r.id
                 inner join cms_nest.sys_group_role gr on r.id = gr.roleId
                 inner join cms_nest.sys_group g on gr.groupId = g.id
                 inner join cms_nest.sys_user_group ug on g.id = ug.groupId
                 inner join cms_nest.sys_user u on u.id = ug.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let permissions2 = await this.userRepository.query(`
        select p.*
        from cms_nest.sys_permission p
                 inner join cms_nest.sys_role_permission rp on p.id = rp.permissionId
                 inner join cms_nest.sys_role r on rp.roleId = r.id
                 inner join cms_nest.sys_user_role ur on r.id = ur.roleId
                 inner join cms_nest.sys_user u on u.id = ur.userId
        where u.id = '${baseFindByIdDto}'
    `);

    let res = Utils.uniqBy(Utils.concat(permissions1, permissions2), 'id');

    return res;
  }
}
