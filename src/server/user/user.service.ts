import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { BindUserGroupDto } from '../user-group/dto/bind-user-group.dto';
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
import { PermissionService } from '../permission/permission.service';
import { ApiException } from '../../common/exception/api-exception';
import { Area } from '../area/entities/area.entity';
import { BindUserPermissionDto } from '../user-permission/dto/bind-user-permission.dto';
import { UserPermission } from '../user-permission/entities/user-permission.entity';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { UserPrefix } from '../../constants/user.prefix';
import { CacheService } from '../cache/cache.service';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { Group } from '../group/entities/group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userinfoService: UserinfoService,
    private readonly groupService: GroupService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly userGroupService: UserGroupService,
    private readonly userRoleService: UserRoleService,
    private readonly userPermissionService: UserPermissionService,
    private readonly cryptoUtil: CryptoUtil,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 获取详情（userName）
   */
  async selectByName(userName: string): Promise<User | undefined> {
    try {
      const ret = await this.userRepository
        .createQueryBuilder()
        .select('User')
        .addSelect('User.userPwd')
        .where('User.userName = :userName AND User.deleteStatus = 0', {
          userName: userName,
        })
        .getOne();

      if (ret) return ret;
      else return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改登录次数
   */
  async incrementLoginCount(id: string): Promise<any> {
    try {
      const client = await this.cacheService.getClient();

      const findOneRet = await this.userRepository.findOne({
        where: {
          id: id,
          deleteStatus: 0,
        },
        select: ['id'],
      });

      if (!findOneRet) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      this.cacheService.client.zadd(`${UserPrefix.ONLINE_USER}`, id, Utils.valueOf());
      const incrementRet = await this.userRepository.increment(
        { id: id },
        'loginCount',
        1,
      );

      if (!incrementRet) {
        throw new ApiException('登录次数异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return incrementRet;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取在线用户
   */
  async selectOnline(curUser?): Promise<any> {
    try {
      return this.cacheService.client.zrevrangebyscore(`${UserPrefix.ONLINE_USER}`, '+inf', '-inf', 'withscores');
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加
   */
  async insert(createUserDto: CreateUserDto, curUser?): Promise<CreateUserDto | void> {
    try {
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
      userinfo.user = user; // 联接两者

      const saveRet = await this.userRepository.save(user);
      const saveUIRet = await this.userinfoService.insert(userinfo);

      if (saveRet && saveUIRet) {
        return createUserDto;
      } else {
        throw new ApiException('保存异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createUserDto: CreateUserDto[], curUser?): Promise<CreateUserDto[] | void> {
    try {
      const userList: CreateUserDto[] = [],
        userinfoList: CreateUserinfoDto[] = [];

      createUserDto.forEach((item) => {
        const { userPwd } = item;
        let user = new User();
        user = Utils.dto2entityImport(item, user);
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
        userinfo.user = user; // 联接两者

        userList.push(user);
        userinfoList.push(userinfo);
      });

      const saveRet = this.userRepository.save(userList);
      const saveUIRet = this.userinfoService.insertBatch(userinfoList);

      if (saveRet && saveUIRet) {
        return createUserDto;
      } else {
        throw new ApiException('保存异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchUserDto: SearchUserDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { userName, name, userType, mobile, email, status } = searchUserDto;

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
        queryConditionList.push('user.mobile LIKE :mobile');
      }
      if (!Utils.isBlank(email)) {
        queryConditionList.push('user.email LIKE :email');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('user.status IN (:status)');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.userinfo', 'userinfo')
        .leftJoinAndSelect(Area, 'p', 'p.id = userinfo.provinceId')
        .leftJoinAndSelect(Area, 'c', 'c.id = userinfo.cityId')
        .leftJoinAndSelect(Area, 'd', 'd.id = userinfo.districtId')
        .select(
          'user.*, userinfo.provinceId, userinfo.cityId, userinfo.districtId, userinfo.address ',
        )
        .addSelect(
          `p.areaName AS provinceName, c.areaName AS cityName, d.areaName AS districtName`,
        )
        .where(queryCondition, {
          userName: `%${userName}%`,
          name: `%${name}%`,
          userType: userType,
          mobile: `%${mobile}%`,
          email: `%${email}%`,
          status: status,
        })
        .orderBy({
          'user.status': 'DESC',
          'user.createTime': 'DESC',
        })
        .getRawMany();

      ret.forEach((v) => {
        const ui = {
          provinceId: v.provinceId,
          cityId: v.cityId,
          districtId: v.districtId,
          address: v.address,
          provinceName: v.provinceName,
          cityName: v.cityName,
          districtName: v.districtName,
        };
        v['userinfo'] = ui;

        delete v.userPwd;
        delete v.provinceId;
        delete v.cityId;
        delete v.address;
        delete v.provinceName;
        delete v.cityName;
        delete v.districtName;
      });

      if (!ret) {
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitUserDto: LimitUserDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, userName, name, userType, mobile, email, status } = limitUserDto;
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
        queryConditionList.push('user.mobile LIKE :mobile');
      }
      if (!Utils.isBlank(email)) {
        queryConditionList.push('user.email LIKE :email');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('user.status IN (:status)');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userGroups', 'userGroups')
        .leftJoinAndSelect(Area, 'p', 'p.id = userinfo.provinceId')
        .leftJoinAndSelect(Area, 'c', 'c.id = userinfo.cityId')
        .leftJoinAndSelect(Area, 'd', 'd.id = userinfo.districtId')
        .select(
          'user.*, userinfo.provinceId, userinfo.cityId, userinfo.districtId, userinfo.address',
        )
        .addSelect(
          `p.areaName AS provinceName, c.areaName AS cityName, d.areaName AS districtName`,
        )
        .where(queryCondition, {
          userName: `%${userName}%`,
          name: `%${name}%`,
          userType: userType,
          mobile: `%${mobile}%`,
          email: `%${email}%`,
          status: status,
        });

      const ret = await queryBuilder
        // .skip(offset)
        // .take(limit)
        .offset(offset)
        .limit(limit)
        .orderBy({
          'user.status': 'DESC',
          'user.createTime': 'DESC',
        })
        .getRawMany();

      for (const v of ret) {
        const { id, provinceId, cityId, districtId, address, provinceName, cityName, districtName } = v;

        const ui = {
          provinceId,
          cityId,
          districtId,
          address,
          provinceName,
          cityName,
          districtName,
        };
        v['userinfo'] = ui;

        // 获取关联 id
        const userGroupRet = await this.userRepository.find({
          relations: ['userGroups'],
          where: {
            id: id,
          },
        });
        const ids = userGroupRet.map(v => v.id);
        const groupRet = await this.userGroupService.selectByIds(ids);
        v['group'] = groupRet;

        delete v.userPwd;
        delete v.provinceId;
        delete v.cityId;
        delete v.address;
        delete v.provinceName;
        delete v.cityName;
        delete v.districtName;
      }

      const retCount = await queryBuilder.getCount();

      if (!ret) {
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return {
        list: ret,
        total: retCount,
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.userRepository.findOne({
        relations: ['userinfo', 'userGroups', 'userRoles', 'userPermissions'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      if (ret?.userGroups?.length > 0) {
        const ids = ret.userGroups.map((v) => v.id);

        const userGroupRet = await this.userGroupService.selectByIds(ids);
        const userGroups = userGroupRet.filter(v => v.group).map((v) => {
          return v.group;
        });
        // @ts-ignore
        ret.userGroups = Utils.uniqBy(userGroups, 'id');
      }

      if (ret?.userRoles?.length > 0) {
        const ids = ret.userRoles.map((v) => v.id);

        const userRoleRet = await this.userRoleService.selectByIds(ids);
        const userRoles = userRoleRet.filter(v => v.role).map((v) => {
          return v.role;
        });
        // @ts-ignore
        ret.userRoles = userRoles;
      }

      if (ret?.userPermissions?.length > 0) {
        const ids = ret.userPermissions.map((v) => v.id);

        const userPermissionRet = await this.userPermissionService.selectByIds(ids);
        const userPermissions = userPermissionRet.filter(v => v.permission).map((v) => {
          return v.permission;
        });
        // @ts-ignore
        ret.userPermissions = userPermissions;
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.userRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（用户名）
   */
  async isExistUserName(userName: string): Promise<boolean> {
    try {
      const isExist = await this.userRepository.findOne({ userName: userName });
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateUserDto: UpdateUserDto, curUser?): Promise<UpdateUserDto | void> {
    try {
      const { id } = updateUserDto;

      let user = new User();
      user = Utils.dto2entity(updateUserDto, user);
      if (curUser) {
        user.updateBy = curUser!.id;
      }

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
      userinfo.user = user; // 联接两者

      const [updateRet, updateUIRet] = await Promise.all([
        this.userRepository.update(id, user),
        this.userinfoService.updateByUserId(id, userinfo),
      ]);

      if (updateRet && updateUIRet) {
        return updateUserDto;
      } else {
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { ids, status } = baseModifyStatusByIdsDto;
      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      const ret = this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ status: status, updateBy: curUser ? curUser!.id : null })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id = :id', { id: id })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      const ret = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定用户组
   */
  async bindGroups(bindUserGroupDto: BindUserGroupDto): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { id, groups } = bindUserGroupDto;

      if (groups && !Utils.isArray(groups)) {
        groups = Utils.split(',');
      }

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
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.userGroupService.insertBatch(userGroups);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取用户组
   */
  async selectGroupsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userRepository.findOne({
        relations: ['userGroups'],
        where: {
          id: id,
        },
      });

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定角色
   */
  async bindRoles(bindUserRoleDto: BindUserRoleDto): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { id, roles } = bindUserRoleDto;

      if (roles && !Utils.isArray(roles)) {
        roles = Utils.split(',');
      }

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
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.userRoleService.insertBatch(userRoles);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色
   */
  async selectRolesByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userRepository.findOne({
        relations: ['userRoles'],
        where: {
          id: id,
        },
      });

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定权限
   */
  async bindPermissions(bindUserPermissionDto: BindUserPermissionDto): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { id, permissions } = bindUserPermissionDto;

      if (permissions && !Utils.isArray(permissions)) {
        permissions = Utils.split(',');
      }

      const userRet = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      const userPermissions = [];
      for (const item of permissions) {
        const permissionRet = await this.permissionService.selectById({ id: item });
        const userPermission = new UserPermission();
        userPermission.user = userRet;
        userPermission.permission = permissionRet;

        userPermissions.push(userPermission);
      }

      const deleteRet = await this.userPermissionService.deleteByUserId(id);
      if (!deleteRet) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.userPermissionService.insertBatch(userPermissions);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限
   */
  async selectPermissionsByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userRepository.findOne({
        relations: ['userPermissions'],
        where: {
          id: id,
        },
      });

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（权限合集）
   */
  async selectAuthPByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      return await this.permissionService.selectByUserId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（用户、用户组、角色、权限合集）
   */
  async selectAuthUGRPByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const userRet = await this.selectById(baseFindByIdDto);

      if (userRet?.userType === 2) {
        const [permissionRet, roleRet, groupRet] = await Promise.all([
          this.permissionService.selectAll({}),
          this.roleService.selectRByUserId(baseFindByIdDto),
          this.groupService.selectByUserId(baseFindByIdDto),
        ]);

        const res = Utils.assign(userRet, {
          permissions: permissionRet,
          roles: roleRet,
          groups: groupRet,
        });

        return res;
      } else {
        const [permissionRet, roleRet, groupRet] = await Promise.all([
          this.permissionService.selectPByUserId(baseFindByIdDto),
          this.roleService.selectRByUserId(baseFindByIdDto),
          this.groupService.selectByUserId(baseFindByIdDto),
        ]);

        const res = Utils.assign(userRet, {
          permissions: permissionRet,
          roles: roleRet,
          groups: groupRet,
        });

        return res;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
