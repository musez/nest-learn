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

// 权限路由 HIDDEN
export enum PermissionHiddenType {
  SHOW = 0,
  HIDDEN = 1,
}

@Entity('sys_menu')
export class Menu extends BaseEntity {
  constructor() {
    super();

    this.parentId = undefined;
    // this.name = undefined;
    // this.routerPath = undefined;
    // this.routerName = undefined;
    // this.routerRedirect = undefined;
    this.routerComponent = undefined;
    this.routerHidden = undefined;
    this.routerTitle = undefined;
    this.routerIcon = undefined;
    this.routerSort = undefined;
    this.code = undefined;
    // this.routerUri = undefined;+
    //  +组件地址
    //  +按钮名称
    //  +权限标识
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

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

  @Column({ comment: '权限 CODE 代码', length: 50 })
  code: string;
}
