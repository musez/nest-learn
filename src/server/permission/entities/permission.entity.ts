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

// 权限路由 HIDDEN
export enum PermissionHiddenType {
  SHOW = 0,
  HIDDEN = 1,
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
    this.routerPath = undefined;
    this.routerName = undefined;
    this.routerRedirect = undefined;
    this.routerComponent = undefined;
    this.routerHidden = undefined;
    this.routerTitle = undefined;
    this.routerIcon = undefined;
    this.routerSort = undefined;
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

  @Column({ comment: '权限路由 PATH', length: 50, nullable: true })
  routerPath: string;

  @Column({ comment: '权限路由 NAME', length: 50, nullable: true })
  routerName: string;

  @Column({ comment: '权限路由 REDIRECT', length: 50, nullable: true })
  routerRedirect: string;

  @Column({ comment: '权限路由 COMPONENT', length: 50, nullable: true })
  routerComponent: string;

  @Column('tinyint', { comment: '权限路由 HIDDEN（0：显示；1：隐藏；）', nullable: true })
  routerHidden: PermissionHiddenType;

  @Column({ comment: '权限路由 TITLE', length: 50, nullable: true })
  routerTitle: string;

  @Column({ comment: '权限路由 ICON', length: 50, nullable: true })
  routerIcon: string;

  @Column({ comment: '权限路由 SORT', default: 0, nullable: true })
  routerSort: number;

  @TreeChildren({ cascade: true })
  children: Permission[];

  @TreeParent()
  parent: Permission;

  @OneToMany(type => Role, role => role.permissions)
  roles: Role[];
}
