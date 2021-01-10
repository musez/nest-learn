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

@Entity('role')
export class Role extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  name: string;

  // @ManyToMany(() => Group, group => group.roles)
  // groups: Group[];

  @OneToMany(
    type => Group,
    group => group.roles,
  )
  groups: Group[];

  // @ManyToMany(() => Permission, permission => permission.roles)
  // @JoinTable()
  // permissions: Permission[];


  @OneToMany(
    type => Permission,
    permission => permission.roles,
  )
  @JoinTable()
  permissions: Permission[];
}
