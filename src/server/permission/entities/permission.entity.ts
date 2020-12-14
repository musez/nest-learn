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
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('permission')
@Tree('closure-table')
export class Permission extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @TreeChildren()
  children: Permission[];

  @TreeParent()
  parent: Permission;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
