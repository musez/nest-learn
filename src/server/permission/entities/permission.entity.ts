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
import { Role } from '../../role/entities/role.entity';

// 权限类别
export enum PermissionType {
  NAVIGATION = 0,
  PAGE = 1,
  ACTION = 1,
  FIELD = 1,
}

@Entity('permission')
@Tree('closure-table')
export class Permission extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    this.type = undefined;
    this.code = undefined;
    this.uri = undefined;
    this.children = undefined;
    this.parent = undefined;
    this.roles = undefined;
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @Column('tinyint', { comment: '权限类别（1：导航；2：页面；3：操作；4：字段）' })
  type: PermissionType;

  @Column({ comment: '权限 CODE 代码', length: 50 })
  code: string;

  @Column({ comment: '权限 URI 规则', length: 50 })
  uri: string;

  @TreeChildren({ cascade: true })
  children: Permission[];

  @TreeParent()
  parent: Permission;

  @OneToMany(type => Role, role => role.permissions)
  roles: Role[];
}
