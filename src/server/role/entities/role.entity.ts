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
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { GroupRole } from '../../group-role/entities/group-role.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity('sys_role')
export class Role extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    // this.groups = undefined;
    // this.users = undefined;
    // this.permissions = undefined;
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @OneToMany((type) => GroupRole, (groupRoles) => groupRoles.role)
  groupRoles: GroupRole[];

  @OneToMany((type) => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany((type) => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
