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
import { Staff } from '../../staff/entities/staff.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('role')
export class Role extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  staffName: string;

  @ManyToMany(() => Staff, staff => staff.roles)
  staffs: Staff[];

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
