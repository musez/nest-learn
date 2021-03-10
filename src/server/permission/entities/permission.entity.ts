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
import { PermissionHiddenType } from '../../menu/entities/menu.entity';

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
    this.routerComponent = undefined;
    this.routerHidden = undefined;
    this.routerIcon = undefined;
    this.routerSort = undefined;
    this.routerPath = undefined;
    this.roles = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @Column('tinyint', { comment: '权限类别（1：目录；2：菜单；3：操作；4：字段；5：数据）' })
  type: PermissionType;

  @Column({ comment: '权限 CODE 代码', length: 50 })
  code: string;

  @Column({ comment: '权限路由 COMPONENT', length: 50, nullable: true })
  routerComponent: string;

  @Column('tinyint', { comment: '权限路由 HIDDEN（0：显示；1：隐藏；）', nullable: true })
  routerHidden: PermissionHiddenType;

  @Column({ comment: '权限路由 ICON', length: 50, nullable: true })
  routerIcon: string;

  @Column({ comment: '权限路由 SORT', default: 0, nullable: true })
  routerSort: number;

  @Column({ comment: '权限路由 PATH', length: 50, nullable: true })
  routerPath: string;

  @OneToMany(type => Role, role => role.permissions)
  roles: Role[];
}
