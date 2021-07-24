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
import { BaseEntity } from '../../base.entity';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('sys_group')
export class Group extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    // this.users = undefined;
    // this.roles = undefined;
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @OneToMany(type => User, user => user.groups)
  users: User[];

  @OneToMany(type => Role, role => role.groups)
  roles: Role[];
}
