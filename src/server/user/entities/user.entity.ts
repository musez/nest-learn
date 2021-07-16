import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base.entity';
import { Userinfo } from '../../userinfo/entities/userinfo.entity';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';
import { UserType, SexType } from '../../../constants/dicts';

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

  @Column('varchar', { comment: '名称', length: 50 })
  userName: string;

  @Column('varchar', { comment: '密码', length: 100, select: false })
  @Exclude()
  userPwd: string;

  @Column('tinyint', { comment: '用户类型（0：普通用户；1：管理员；2：超级管理员；）', default: UserType.NORMAL })
  userType: UserType;

  @Column('varchar', { comment: '姓名', length: 50, nullable: true })
  name: string;

  @Column('varchar', { comment: '手机号', length: 20, nullable: true })
  mobile: string;

  @Column('varchar', { comment: '邮箱', length: 20, nullable: true })
  email: string;

  @Column('tinyint', { comment: '性别（0：保密；1：男；2：女）', nullable: true, default: SexType.DEFAULT })
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

  @OneToMany(type => Group, group => group.users)
  groups: Group[];

  @OneToMany(type => Role, role => role.users)
  roles: Role[];
}
