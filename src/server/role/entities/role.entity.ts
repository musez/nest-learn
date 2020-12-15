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
import { StaffGroup } from '../../staff-group/entities/staff-group.entity';

@Entity('role')
export class Role extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  staffName: string;

  @ManyToMany(() => StaffGroup, staffGroup => staffGroup.roles)
  staffGroups: StaffGroup[];

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
