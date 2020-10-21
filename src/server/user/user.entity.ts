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
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class Users {
  @ApiProperty({
    description: '主键',
  })
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '主键id',
  })
  id: number;

  @ApiProperty({
    description: '名称',
  })
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @ApiProperty({
    description: '密码',
  })
  @Column('varchar', {
    comment: '密码',
    length: 50,
  })
  userPwd: string;

  @ApiProperty({
    description: '姓名',
  })
  @Column('varchar', {
    comment: '姓名',
    length: 50,
    nullable: true,
  })
  name: string;

  @ApiProperty({
    description: '手机号',
  })
  @Column('varchar', {
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  mobile: string;

  @ApiProperty({
    description: '邮箱',
  })
  @Column('varchar', {
    comment: '邮箱',
    length: 20,
    nullable: true,
  })
  email: string;

  @ApiProperty({
    description: '性别',
  })
  @Column({ comment: '性别', nullable: true })
  sex: number;

  @ApiProperty({
    description: '生日',
  })
  @Column({
    comment: '生日',
    nullable: true,
  })
  birthday: Date;

  @ApiProperty({
    description: '省份',
  })
  @Column({
    comment: '省份',
    nullable: true,
  })
  provinceId: number;

  @ApiProperty({
    description: '城市',
  })
  @Column({
    comment: '城市',
    nullable: true,
  })
  cityId: number;

  @ApiProperty({
    description: '区/县',
  })
  @Column({
    comment: '区/县',
    nullable: true,
  })
  districtId: number;

  @ApiProperty({
    description: '详细地址',
  })
  @Column({
    comment: '详细地址',
    length: 100,
    nullable: true,
  })
  address: string;

  @ApiProperty({
    description: '状态（0：禁用；1：启用）',
  })
  @Column('tinyint', {
    comment: '状态（0：禁用；1：启用）',
    default: () => 0,
  })
  status: number;

  @ApiProperty({
    description: '描述',

  })
  @Column('text', {
    comment: '描述',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: '创建时间',
  })
  @Column({
    comment: '创建时间',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  createTime: Date;

  @ApiProperty({
    description: '修改时间',
  })
  @Column({
    comment: '修改时间',
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
  })
  updateTime: Date;

  @ApiProperty({
    description: '最后登录时间',
  })
  @Column({
    comment: '最后登录时间',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  loginTime: Date;

  @ApiProperty({
    description: '登录次数',
  })
  @Column({
    comment: '登录次数',
    nullable: true,
  })
  loginCount: number;
}
