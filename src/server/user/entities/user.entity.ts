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
import { Group } from '../../group/entities/group.entity';
import { Userinfo } from '../../userinfo/entities/userinfo.entity';


// 状态类型
export enum statusType {
  ENABLE = 1,
  DISABLE = 0,
}

// 性别类型
export enum sexType {
  DEFAULT = 0,
  FEMALE = 1,
  MALE = 2,
}

// 用户类型
export enum userType {
  ADMIN = 1,
  NORMAL = 0,
}

@Entity('user')
export class User extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @Column('varchar', {
    comment: '密码',
    length: 100,
  })
  @Exclude()
  userPwd: string;

  @Column('tinyint', {
    comment: '用户类型',
    nullable: false,
    default: () => 0,
  })
  userType: number;

  @Column('varchar', {
    comment: '姓名',
    length: 50,
    nullable: true,
  })
  name: string;

  @Column('varchar', {
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  mobile: string;

  @Column('varchar', {
    comment: '邮箱',
    length: 20,
    nullable: true,
  })
  email: string;

  @Column('tinyint', {
    comment: '性别（0：保密；1：男；2：女）',
    nullable: true,
    default: 0,
  })
  sex: number;

  @Column({
    type: 'date',
    comment: '生日',
    nullable: true,
  })
  birthday: Date;

  @Column({
    comment: '最后登录时间',
    type: 'datetime',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
  })
  loginTime: Date;

  @Column({
    comment: '登录次数',
    nullable: true,
    default: () => 0,
  })
  loginCount: number;

  @OneToOne((type) => Userinfo, (userinfo) => userinfo.user, {
    cascade: true,
  })
  userinfo: Userinfo;

  // @ManyToMany(() => Group, group => group.users, {
  //   cascade: true,
  // })
  // @JoinTable()
  // groups: Group[];

  @OneToMany(
    type => Group,
    group => group.users,
  )
  groups: Group[];
}
