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
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

@Entity('role')
export class Role extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @ManyToMany(() => UserGroup, userGroup => userGroup.roles)
  userGroups: UserGroup[];

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
