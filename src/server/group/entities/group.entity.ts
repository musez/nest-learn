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

@Entity('group')
export class Group extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  name: string;

  // @ManyToMany(() => User, user => user.groups)
  // users: User[];

  @OneToMany(
    type => User,
    user => user.groups,
  )
  users: User[];

  // @ManyToMany(() => Role, role => role.groups)
  // @JoinTable()
  // roles: Role[];

  @OneToMany(
    type => Role,
    role => role.groups,
  )
  roles: Role[];
}
