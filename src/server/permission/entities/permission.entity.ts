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

@Entity('permission')
@Tree('closure-table')
export class Permission extends BaseEntity {
  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @Column('tinyint', { comment: '权限类别（1：导航；2：页面；3：操作；4：字段）', default: () => 0 })
  type: number;

  @Column({ comment: '权限 CODE 代码', length: 50, default: '' })
  code: string;

  @Column({ comment: '权限 URI 规则', length: 50, default: '' })
  uri: string;

  @Column({ comment: '权限路由 PATH', length: 50, default: '' })
  routerPath: string;

  @Column({ comment: '权限路由 NAME', length: 50, default: '' })
  routerName: string;

  @Column({ comment: '权限路由 REDIRECT', length: 50, default: '' })
  routerRedirect: string;

  @Column({ comment: '权限路由 COMPONENT', length: 50, default: '' })
  routerComponent: string;

  @Column('tinyint', { comment: '权限路由 HIDDEN（0：不隐藏；1：隐藏；）', default: () => 0 })
  routerHidden: number;

  @Column({ comment: '权限路由 TITLE', length: 50, default: '' })
  routerTitle: string;

  @Column({ comment: '权限路由 ICON', length: 50, default: '' })
  routerIcon: string;

  @Column({ comment: '权限路由 SORT', default: 0 })
  routerSort: number;

  @TreeChildren({ cascade: true })
  children: Permission[];

  @TreeParent()
  parent: Permission;

  @OneToMany(type => Role, role => role.permissions)
  roles: Role[];
}
