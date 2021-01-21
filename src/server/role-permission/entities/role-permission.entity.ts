import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('role_permission')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '角色 id' })
  roleId!: string;

  @Column({ comment: '权限 id' })
  permissionId!: string;

  @ManyToOne(type => Role, role => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(type => Permission, permission => permission.roles)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
