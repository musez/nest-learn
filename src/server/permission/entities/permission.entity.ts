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

@Entity('sys_permission')
export class Permission extends BaseEntity {
  constructor() {
    super();

    this.parentId = undefined;
    this.name = undefined;
    this.type = undefined;
    this.code = undefined;
    this.roles = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @Column('tinyint', { comment: '权限类别（1：目录；2：菜单；3：操作；4：字段）' })
  type: PermissionType;

  @Column({ comment: '权限 CODE 代码', length: 50 })
  code: string;

  @OneToMany(type => Role, role => role.permissions)
  roles: Role[];
}
