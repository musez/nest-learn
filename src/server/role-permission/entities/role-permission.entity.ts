import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne, Column,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('sys_role_permission')
export class RolePermission {
  // constructor() {
  //   this.id = undefined;
  //   this.roleId = undefined;
  //   this.permissionId = undefined;
  //   this.role = undefined;
  //   this.permission = undefined;
  // }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => Role, (role) => role.rolePermissions)
  // @JoinColumn({ name: 'roleId' })
  @JoinColumn()
  role: Role;

  @Column('uuid', { comment: '角色 id', nullable: true })
  roleId: string;

  @ManyToOne((type) => Permission, (permission) => permission.rolePermissions)
  // @JoinColumn({ name: 'permissionId' })
  @JoinColumn()
  permission: Permission;

  @Column('uuid', { comment: '权限 id', nullable: true })
  permissionId: string;
}
