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
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('user_group')
export class UserGroup extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  name: string;

  @ManyToMany(() => User, user => user.userGroups)
  users: User[];

  @ManyToMany(() => Role, role => role.userGroups)
  @JoinTable()
  roles: Role[];
}
