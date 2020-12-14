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
import { Role } from '../../role/entities/role.entity';

@Entity('staff')
export class Staff extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  staffName: string;

  @Column('varchar', {
    comment: '密码',
    length: 50,
  })
  @Exclude()
  staffPwd: string;

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

  @ManyToMany(() => Role, role => role.staffs)
  @JoinTable()
  roles: Role[];
}
