import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  AfterLoad,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base.entity';
import { Userinfo } from '../../userinfo/entities/userinfo.entity';
import { UserType, SexType } from '../../../constants/dicts.enum';
import { UserAddress } from '../../user-address/entities/user-address.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';
import * as dayjs from 'dayjs';

@Entity('sys_user')
export class User extends BaseEntity {
  constructor() {
    super();

    this.userName = undefined;
    this.userPwd = undefined;
    this.userType = undefined;
    this.name = undefined;
    this.mobile = undefined;
    this.email = undefined;
    this.sex = undefined;
    this.birthday = undefined;
    this.loginTime = undefined;
    this.loginCount = undefined;
    // this.userinfo = undefined;
    // this.groups = undefined;
    // this.roles = undefined;
  }

  @AfterLoad()
  updateDate() {
    if (this.loginTime) {
      // @ts-ignore
      this.loginTime = dayjs(this.loginTime).format('YYYY-MM-DD hh:mm:ss');
    }
  }

  @Column('varchar', { comment: '名称', length: 50, unique: true })
  userName: string;

  @Column('varchar', { comment: '密码', length: 100, select: false })
  @Exclude()
  userPwd: string;

  @Column('tinyint', {
    comment: '用户类型（0：普通用户；1：管理员；2：超级管理员；）',
    default: UserType.NORMAL,
  })
  userType: UserType;

  @Column('varchar', { comment: '姓名', length: 50, nullable: true })
  name: string;

  @Column('varchar', { comment: '手机号', length: 20, nullable: true })
  mobile: string;

  @Column('varchar', { comment: '邮箱', length: 20, nullable: true })
  email: string;

  @Column('tinyint', {
    comment: '性别（0：保密；1：男；2：女）',
    nullable: true,
    default: SexType.SECRET,
  })
  sex: SexType;

  @Column({ type: 'date', comment: '生日', nullable: true })
  birthday: Date;

  @Column({
    comment: '最后登录时间',
    type: 'datetime',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
    nullable: true,
  })
  loginTime: Date;

  @Column({ comment: '登录次数', nullable: true, default: () => 0 })
  loginCount: number;

  @OneToOne((type) => Userinfo, (userinfo) => userinfo.user, {
    // cascade: true
  })
  userinfo: Userinfo;

  @OneToMany((type) => UserAddress, (userAddress) => userAddress.user, {
    // cascade: true
  })
  userAddress: UserAddress[];

  @OneToMany((type) => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];

  @OneToMany((type) => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  // @OneToMany((type) => UserPermission, (userPermission) => userPermission.user)
  // userPermissions: UserPermission[];
}
