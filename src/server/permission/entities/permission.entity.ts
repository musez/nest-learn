import {
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
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
import { BaseConstants } from '../../../constants/constants';
import {
  PermissionType,
  PermissionHiddenType,
} from '../../../constants/dicts.enum';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';

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
    this.sort = undefined;
    this.routerPath = undefined;
    // this.roles = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '名称', length: 50 })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, {
    message: '名称不能大于 $constraint1 位！',
  })
  name: string;

  @Column('tinyint', {
    comment: '权限类别（1：目录；2：菜单；3：操作；4：字段；5：数据）',
  })
  type: PermissionType;

  @Column({ comment: '权限 CODE 代码', length: 50, nullable: true })
  code: string;

  @Column({ comment: '权限 SORT', default: 0, nullable: true })
  sort: number;

  @Column({ comment: '权限路由 COMPONENT', length: 50, nullable: true })
  routerComponent: string;

  @Column('tinyint', {
    comment: '权限路由 HIDDEN（0：显示；1：隐藏；）',
    nullable: true,
  })
  routerHidden: PermissionHiddenType;

  @Column({ comment: '权限路由 ICON', length: 50, nullable: true })
  routerIcon: string;

  @Column({ comment: '权限路由 PATH', length: 50, nullable: true })
  routerPath: string;

  @OneToMany(
    (type) => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
