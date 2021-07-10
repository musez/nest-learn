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
import { CreateRolePermissionDto } from '../role-permission/dto/create-role-permission.dto';
import { CreateUserinfoDto } from '../userinfo/dto/create-userinfo.dto';

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
    const userEntity = await this.userRepository.findOne({
      where: {
        id: baseFindByIdDto,
        deleteStatus: 0,
      },
      select: ['id'],
    });

    return await this.userRepository.increment(userEntity, 'loginCount', 1);
  }

  /**
   * 添加
   */
  async insert(createUserDto: CreateUserDto, curUser?): Promise<CreateUserDto> {
    const { userPwd } = createUserDto;

    let user = new User();
    user = Utils.dto2entity(createUserDto, user);
    if (Utils.isBlank(userPwd)) {
      user.userPwd = this.cryptoUtil.encryptPassword('888888');
    } else {
      user.userPwd = this.cryptoUtil.encryptPassword(userPwd);
    }
    user.createBy = curUser && curUser.id;

    const userinfo = new Userinfo();
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
   * 添加（批量）
   */
  async insertBatch(createUserDto: CreateUserDto[], curUser?): Promise<CreateUserDto[]> {
    const userList: CreateUserDto[] = [],
      userinfoList: CreateUserinfoDto[] = [];

    createUserDto.forEach(item => {
      const { userPwd } = item;
      let user = new User();
      user = Utils.dto2entityImport(item, user);
      if (Utils.isBlank(userPwd)) {
        user.userPwd = this.cryptoUtil.encryptPassword('888888');
      } else {
        user.userPwd = this.cryptoUtil.encryptPassword(userPwd);
      }
      user.createBy = curUser && curUser.id;

      const userinfo = new Userinfo();
      if (!Utils.isBlank(item.provinceId)) {
        userinfo.provinceId = item.provinceId;
      }
      if (!Utils.isBlank(item.cityId)) {
        userinfo.cityId = item.cityId;
      }
      if (!Utils.isBlank(item.districtId)) {
        userinfo.districtId = item.districtId;
      }
      if (!Utils.isBlank(item.address)) {
        userinfo.address = item.address;
      }
      // userinfo = Utils.dto2entity(createUserDto, userinfo);
      userinfo.user = user;// 联接两者

      userList.push(user);
      userinfoList.push(userinfo);
    });
    // console.log(userList);
    // console.log(userinfoList);
    await this.userRepository.save(userList);
    await this.userinfoService.insertBatch(userinfoList);

    return createUserDto;
  }

  /**
   * 获取列表
   */
  async selectList(searchUserDto: SearchUserDto): Promise<any[]> {
    const { userName, name, userType, mobile, email } = searchUserDto;

    const queryConditionList = [];
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
    const queryCondition = queryConditionList.join(' AND ');

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
    const offset = (page - 1) * limit;

    const queryConditionList = [];
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
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.userRepository.createQueryBuilder('user')
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
    const { id } = baseFindByIdDto;
    return await this.userRepository.findOne(id, { relations: ['userinfo'] });
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.userRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 是否存在（用户名）
   */
  async isExistUserName(userName: string): Promise<boolean> {
    const isExist = await this.userRepository.findOne({ userName: userName });
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
    const { id } = updateUserDto;

    let user = new User();
    user = Utils.dto2entity(updateUserDto, user);
    user.updateBy = curUser && curUser.id;

    const userinfo = new Userinfo();
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
    const { ids, status } = baseModifyStatusByIdsDto;

    return this.userRepository.createQueryBuilder()
      .update(User)
      .set({ status: status, updateBy: curUser && curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    // this.userRepository.delete(id);
    // await this.userinfoService.deleteByUserId(id);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser && curUser.id })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    const { ids } = baseFindByIdsDto;

    // this.userRepository.delete(ids);
    // await this.userinfoService.deleteByUserId(ids);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser && curUser.id })
      .where('ids in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 绑定用户组
   */
  async bindGroups(bindUserGroupDto: BindUserGroupDto): Promise<void> {
    const { id, groups } = bindUserGroupDto;

    const userGroupList = [];
    for (let i = 0, len = groups.length; i < len; i++) {
      const createUserGroupDto = new CreateUserGroupDto();
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
    const { id, roles } = bindUserRoleDto;

    const userGroupList = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      const createUserRoleDto = new CreateUserRoleDto();
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
   * 获取权限
   */
  async selectPermissionsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const permissions1 = await this.userRepository.query(`
        SELECT p.*
        FROM cms_nest.sys_permission p
                 INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
                 INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
                 INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
                 INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
                 INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
                 INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND g.deleteStatus = 0
          AND r.deleteStatus = 0
          AND p.deleteStatus = 0`);

    const permissions2 = await this.userRepository.query(`
        SELECT p.*
        FROM cms_nest.sys_permission p
                 INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
                 INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
                 INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
                 INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND r.deleteStatus = 0
          AND p.deleteStatus = 0`);

    const res = Utils.uniqBy(Utils.concat(permissions1, permissions2), 'id');

    return res;
  }

  /**
   * 获取用户、用户组、角色、权限
   */
  async selectAuthByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const userEntity = await this.selectById(baseFindByIdDto);

    const permissions1 = await this.userRepository.query(`
        SELECT p.*
        FROM cms_nest.sys_permission p
                 INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
                 INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
                 INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
                 INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
                 INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
                 INNER JOIN cms_nest.sys_user u on u.id = ug.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND g.deleteStatus = 0
          AND r.deleteStatus = 0
          AND p.deleteStatus = 0`);

    const permissions2 = await this.userRepository.query(`
        SELECT p.*
        FROM cms_nest.sys_permission p
                 INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
                 INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
                 INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
                 INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND r.deleteStatus = 0
          AND p.deleteStatus = 0`);

    const role1 = await this.userRepository.query(`
        SELECT r.*
        FROM cms_nest.sys_role r
                 INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
                 INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
                 INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
                 INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND g.deleteStatus = 0
          AND r.deleteStatus = 0`);

    const role2 = await this.userRepository.query(`
        SELECT r.*
        FROM cms_nest.sys_role r
                 INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
                 INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND r.deleteStatus = 0`);

    const group1 = await this.userRepository.query(`
        SELECT g.*
        FROM cms_nest.sys_group g
                 INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
                 INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
        WHERE u.id = '${baseFindByIdDto}'
          AND u.deleteStatus = 0
          AND g.deleteStatus = 0`);

    const res = Utils.assign(userEntity, {
      permissions: Utils.uniqBy(Utils.concat(permissions1, permissions2), 'id'),
      roles: Utils.uniqBy(Utils.concat(role1, role2), 'id'),
      groups: group1,
    });

    return res;
  }
}
