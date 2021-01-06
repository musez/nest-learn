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

@Entity('permission')
@Tree('closure-table')
export class Permission extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  name: string;

  @Column('tinyint', {
    comment: '权限类别（1：导航；2：页面；3：操作；4：字段）',
    default: () => 0,
  })
  type: number;

  @Column({
    comment: '权限 CODE 代码',
    default: '',
  })
  code: string;

  @Column({
    comment: '权限 URL 规则',
    default: '',
  })
  uri: string;

  @TreeChildren()
  children: Permission[];

  @TreeParent()
  parent: Permission;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
