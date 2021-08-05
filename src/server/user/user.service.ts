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
import { UserGroup } from '../user-group/entities/user-group.entity';
import { BindUserRoleDto } from '../user-role/dto/bind-user-role.dto';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserRoleService } from '../user-role/user-role.service';
import { UserinfoService } from '../userinfo/userinfo.service';
import { SearchUserDto } from './dto/search-user.dto';
import { LimitUserDto } from './dto/limit-user.dto';
import { CryptoUtil } from '../../utils/crypto.util';
import { CreateUserinfoDto } from '../userinfo/dto/create-userinfo.dto';
import { GroupService } from '../group/group.service';
import { RoleService } from '../role/role.service';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { Role } from '../role/entities/role.entity';
import { GroupRole } from '../group-role/entities/group-role.entity';
import { Group } from '../group/entities/group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userinfoService: UserinfoService,
    private readonly groupService: GroupService,
    private readonly userGroupService: UserGroupService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly cryptoUtil: CryptoUtil,
  ) {
  }

  /**
   * 获取详情（userName）
   */
  async selectByName(userName: string): Promise<User | undefined> {
    const ret = await this.userRepository.createQueryBuilder()
      .select('User')
      .addSelect('User.userPwd')
      .where('User.userName = :userName AND User.deleteStatus = 0', {
        userName: userName,
      })
      .getOne();

    if (ret) return ret;
    else return null;
  }

  /**
   * 修改登录次数
   */
  async incrementLoginCount(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const findOneRet = await this.userRepository.findOne({
      where: {
        id: baseFindByIdDto,
        deleteStatus: 0,
      },
      select: ['id'],
    });

    if (!findOneRet) {
      throw new BadRequestException(`数据 id：${baseFindByIdDto} 不存在！`);
    }

    const incrementRet = await this.userRepository.increment(findOneRet, 'loginCount', 1);

    if (!incrementRet) {
      throw new BadRequestException('登录次数异常！');
    }

    return incrementRet;
  }

  /**
   * 添加
   */
  async insert(createUserDto: CreateUserDto, curUser?): Promise<CreateUserDto | void> {
    const { userPwd } = createUserDto;

    let user = new User();
    user = Utils.dto2entity(createUserDto, user);
    // 未传入密码时，使用默认密码；传入密码时，使用传入密码
    if (Utils.isBlank(userPwd)) {
      user.userPwd = this.cryptoUtil.encryptPassword('888888');
    } else {
      user.userPwd = this.cryptoUtil.encryptPassword(userPwd);
    }
    if (curUser) {
      user.createBy = curUser!.id;
    }

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

    const [saveRet, saveUIRet] = await Promise.all([
      this.userRepository.save(user),
      this.userinfoService.insert(userinfo),
    ]);

    if (saveRet && saveUIRet) {
      return createUserDto;
    } else {
      throw new BadRequestException('保存异常！');
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createUserDto: CreateUserDto[], curUser): Promise<CreateUserDto[] | void> {
    const userList: CreateUserDto[] = [],
      userinfoList: CreateUserinfoDto[] = [];

    createUserDto.forEach(item => {
      const { userPwd } = item;
      let user = new User();
      user = Utils.dto2entityImport(item, user);
      // 未传入密码时，使用默认密码；传入密码时，使用传入密码
      if (Utils.isBlank(userPwd)) {
        user.userPwd = this.cryptoUtil.encryptPassword('888888');
      } else {
        user.userPwd = this.cryptoUtil.encryptPassword(userPwd);
      }
      user.createBy = curUser!.id;

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

    const [saveRet, saveUIRet] = await Promise.all([
      this.userRepository.save(userList),
      this.userinfoService.insertBatch(userinfoList),
    ]);

    if (saveRet && saveUIRet) {
      return createUserDto;
    } else {
      throw new BadRequestException('保存异常！');
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchUserDto: SearchUserDto): Promise<any[]> {
    const { side, userName, name, userType, mobile, email } = searchUserDto;

    const queryConditionList = [];
    const orderCondition = {};
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

    if (!Utils.isBlank(side)) {
      const sideArr = side.split(',');

      sideArr.map((v) => {
        const item = v.split(' ');
        const key = item[0], value = item[1];

        if (key && value) {
          return orderCondition[key] = value;
        }
      });
    }

    const ret = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userinfo', 'userinfo')
      .where(queryCondition, {
        userName: `%${userName}%`,
        name: `%${name}%`,
        userType: userType,
        mobile: mobile,
        email: email,
      })
      .orderBy({
        'user.createTime': 'DESC',
      })
      .getMany();

    if (!ret) {
      throw new BadRequestException('查询异常！');
    }

    return ret;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitUserDto: LimitUserDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, userName, name, userType, mobile, email } = limitUserDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
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

    const ret = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userinfo', 'userinfo')
      .where(queryCondition, {
        userName: `%${userName}%`,
        name: `%${name}%`,
        userType: userType,
        mobile: mobile,
        email: email,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'user.createTime': 'DESC',
      })
      .getManyAndCount();

    if (!ret) {
      throw new BadRequestException('查询异常！');
    }

    return {
      list: ret[0],
      total: ret[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    const { id } = baseFindByIdDto;

    const ret = await this.userRepository.findOne(id, {
      relations: ['userinfo', 'userGroups', 'userRoles'],
    });
    if (!ret) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    if (ret?.userGroups) {
      const ids = ret.userGroups.map(v => v.id);

      const userGroupRet = await this.userGroupService.selectByUserIds({
        ids: ids.join(','),
      });

      // @ts-ignore
      ret.userGroups = userGroupRet.map(v => {
        return v.group;
      });
    }

    if (ret?.userRoles) {
      const ids = ret.userRoles.map(v => v.id);

      const userRoleRet = await this.userRoleService.selectByUserIds({
        ids: ids.join(','),
      });

      // @ts-ignore
      ret.userRoles = userRoleRet.map(v => {
        return v.role;
      });
    }

    return ret;
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
  async update(updateUserDto: UpdateUserDto, curUser): Promise<UpdateUserDto | void> {
    const { id } = updateUserDto;

    let user = new User();
    user = Utils.dto2entity(updateUserDto, user);
    user.updateBy = curUser!.id;

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

    const [updateRet, updateUIRet] = await Promise.all([
      this.userRepository.update(id, user),
      this.userinfoService.updateByUserId(id, userinfo),
    ]);

    if (updateRet && updateUIRet) {
      return updateUserDto;
    } else {
      throw new BadRequestException('更新异常！');
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser): Promise<any> {
    const { ids, status } = baseModifyStatusByIdsDto;

    const ret = this.userRepository.createQueryBuilder()
      .update(User)
      .set({ status: status, updateBy: curUser!.id })
      .where('id in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new BadRequestException('更新异常！');
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    const ret = await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();

    if (!ret) {
      throw new BadRequestException('删除异常！');
    }

    return null;
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    const ret = await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('ids in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new BadRequestException('删除异常！');
    }

    return null;
  }

  /**
   * 绑定用户组
   */
  async bindGroups(bindUserGroupDto: BindUserGroupDto): Promise<void> {
    const { id, groups } = bindUserGroupDto;

    const userRet = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    const userGroups = [];
    for (const item of groups) {
      const groupRet = await this.groupService.selectById({ id: item });
      const userGroup = new UserGroup();
      userGroup.user = userRet;
      userGroup.group = groupRet;

      userGroups.push(userGroup);
    }

    const deleteRet = await this.userGroupService.deleteByUserId(id);
    if (!deleteRet) {
      throw new BadRequestException('操作异常！');
    }

    const ret = await this.userGroupService.insertBatch(userGroups);

    if (ret) {
      return null;
    } else {
      throw new BadRequestException('操作异常！');
    }
  }

  /**
   * 获取用户组
   */
  async selectGroupsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    const { id } = baseFindByIdDto;
    const ret = await this.userRepository.findOne({
      relations: ['userGroups'],
      where: {
        id: id,
      },
    });

    return ret;
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindUserRoleDto: BindUserRoleDto): Promise<void> {
    const { id, roles } = bindUserRoleDto;

    const userRet = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    const userRoles = [];
    for (const item of roles) {
      const groupRet = await this.roleService.selectById({ id: item });
      const userRole = new UserRole();
      userRole.user = userRet;
      userRole.role = groupRet;

      userRoles.push(userRole);
    }

    const deleteRet = await this.userRoleService.deleteByUserId(id);
    if (!deleteRet) {
      throw new BadRequestException('操作异常！');
    }

    const ret = await this.userRoleService.insertBatch(userRoles);

    if (ret) {
      return null;
    } else {
      throw new BadRequestException('操作异常！');
    }
  }

  /**
   * 获取角色
   */
  async selectRolesByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    const { id } = baseFindByIdDto;
    const ret = await this.userRepository.findOne({
      relations: ['userRoles'],
      where: {
        id: id,
      },
    });

    return ret;
  }

  /**
   * 获取权限
   */
  async selectPermissionsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const userGroupPermissions = await this.userRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
      .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('p')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userGroupPermissions = await this.userRepository.query(`
    //     SELECT p.*
    //     FROM cms_nest.sys_permission p
    //              INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
    //              INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
    //              INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
    //              INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
    //              INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND g.deleteStatus = 0
    //       AND r.deleteStatus = 0
    //       AND p.deleteStatus = 0`);

    const userPermissions = await this.userRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
      .innerJoinAndSelect(User, 'u', 'u.id = ur.userId')
      // .select('p')
      .where('u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userPermissions = await this.userRepository.query(`
    //     SELECT p.*
    //     FROM cms_nest.sys_permission p
    //              INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
    //              INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
    //              INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND r.deleteStatus = 0
    //       AND p.deleteStatus = 0`);

    const res = Utils.uniqBy(Utils.concat(userGroupPermissions, userPermissions), 'id');

    return res;
  }

  /**
   * 获取用户、用户组、角色、权限
   */
  async selectAuthByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const userEntity = await this.selectById(baseFindByIdDto);

    const userGroupPermissions = await this.userRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
      .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('p')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userGroupPermissions = await this.userRepository.query(`
    //     SELECT p.*
    //     FROM cms_nest.sys_permission p
    //              INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
    //              INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
    //              INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
    //              INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
    //              INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
    //              INNER JOIN cms_nest.sys_user u on u.id = ug.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND g.deleteStatus = 0
    //       AND r.deleteStatus = 0
    //       AND p.deleteStatus = 0`);

    const userPermissions = await this.userRepository.createQueryBuilder('p')
      .innerJoinAndSelect(RolePermission, 'rp', 'p.id = rp.permissionId')
      .innerJoinAndSelect(Role, 'r', 'rp.roleId = r.id')
      .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('p')
      .where('u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0 AND p.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userPermissions = await this.userRepository.query(`
    //     SELECT p.*
    //     FROM cms_nest.sys_permission p
    //              INNER JOIN cms_nest.sys_role_permission rp ON p.id = rp.permissionId
    //              INNER JOIN cms_nest.sys_role r ON rp.roleId = r.id
    //              INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND r.deleteStatus = 0
    //       AND p.deleteStatus = 0`);

    const userGroupRole = await this.userRepository.createQueryBuilder('r')
      .innerJoinAndSelect(GroupRole, 'gr', 'r.id = gr.roleId')
      .innerJoinAndSelect(Group, 'g', 'gr.groupId = g.id')
      .innerJoinAndSelect(UserGroup, 'ug', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('r')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0 AND r.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userGroupRole = await this.userRepository.query(`
    //     SELECT r.*
    //     FROM cms_nest.sys_role r
    //              INNER JOIN cms_nest.sys_group_role gr ON r.id = gr.roleId
    //              INNER JOIN cms_nest.sys_group g ON gr.groupId = g.id
    //              INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND g.deleteStatus = 0
    //       AND r.deleteStatus = 0`);

    const userRole = await this.userRepository.createQueryBuilder('r')
      .innerJoinAndSelect(UserRole, 'ur', 'r.id = ur.roleId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('r')
      .where('u.id = :id AND u.deleteStatus = 0 AND r.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userRole = await this.userRepository.query(`
    //     SELECT r.*
    //     FROM cms_nest.sys_role r
    //              INNER JOIN cms_nest.sys_user_role ur ON r.id = ur.roleId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ur.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND r.deleteStatus = 0`);

    const userGroup = await this.userRepository.createQueryBuilder('g')
      .innerJoinAndSelect(GroupRole, 'gr', 'g.id = ug.groupId')
      .innerJoinAndSelect(User, 'u', 'u.id = ug.userId')
      // .select('g')
      .where('u.id = :id AND u.deleteStatus = 0 AND g.deleteStatus = 0', {
        id: baseFindByIdDto,
      })
      .getMany();

    // const userGroup = await this.userRepository.query(`
    //     SELECT g.*
    //     FROM cms_nest.sys_group g
    //              INNER JOIN cms_nest.sys_user_group ug ON g.id = ug.groupId
    //              INNER JOIN cms_nest.sys_user u ON u.id = ug.userId
    //     WHERE u.id = '${baseFindByIdDto}'
    //       AND u.deleteStatus = 0
    //       AND g.deleteStatus = 0`);

    const res = Utils.assign(userEntity, {
      permissions: Utils.uniqBy(Utils.concat(userGroupPermissions, userPermissions), 'id'),
      roles: Utils.uniqBy(Utils.concat(userGroupRole, userRole), 'id'),
      groups: userGroup,
    });

    return res;
  }
}
