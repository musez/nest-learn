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
import { BaseEntity } from '../../base.entity';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Group } from '../../group/entities/group.entity';

@Entity('sys_role')
export class Role extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    // this.groups = undefined;
    // this.users = undefined;
    // this.permissions = undefined;
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @OneToMany(type => Group, group => group.roles)
  groups: Group[];

  @OneToMany(type => User, user => user.roles)
  @JoinTable()
  users: User[];

  @OneToMany(type => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
