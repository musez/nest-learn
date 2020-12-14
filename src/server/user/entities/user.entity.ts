/**
 * @name: user.schema.ts
 * @author: wy
 * @date: 20201021 09:18
 * @description：user.schema.ts
 * @update: 20201021 09:18
 */
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
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../entities/base.entity';

@Entity('user')
export class User extends BaseEntity {
  // @PrimaryGeneratedColumn('uuid', {
  //   comment: '主键 id',
  // })
  // id: string;

  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @Column('varchar', {
    comment: '密码',
    length: 50,
  })
  @Exclude()
  userPwd: string;

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

  @Column({
    comment: '性别（0：保密；1：男；2：女）',
    nullable: true,
    default: () => 0,
  })
  sex: number;

  @Column({
    comment: '生日',
    nullable: true,
  })
  birthday: Date;

  @Column({
    comment: '省份',
    nullable: true,
  })
  provinceId: number;

  @Column({
    comment: '城市',
    nullable: true,
  })
  cityId: number;

  @Column({
    comment: '区/县',
    nullable: true,
  })
  districtId: number;

  @Column({
    comment: '详细地址',
    length: 100,
    nullable: true,
  })
  address: string;

  // @Column('tinyint', {
  //   comment: '状态（0：禁用；1：启用）',
  //   default: () => 0,
  // })
  // status: number;
  //
  // @Column('text', {
  //   comment: '描述',
  //   nullable: true,
  // })
  // description: string;
  //
  // @CreateDateColumn({
  //   comment: '创建时间',
  //   type: 'datetime',
  // })
  // createTime: Date;
  //
  // @Column({
  //   comment: '创建人 id',
  //   nullable: true,
  // })
  // createBy: string;
  //
  // @UpdateDateColumn({
  //   comment: '修改时间',
  //   type: 'datetime',
  // })
  // updateTime: Date;
  //
  // @Column({
  //   comment: '修改人 id',
  //   nullable: true,
  // })
  // updateBy: string;

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
}
