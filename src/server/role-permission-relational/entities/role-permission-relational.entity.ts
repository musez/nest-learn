import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('role_permission_relational')
export class RolePermissionRelational {
  @PrimaryGeneratedColumn('uuid', {
    comment: '主键 id',
  })
  id: string;

  @Column({ name: 'roleId' })
  roleId!: string;

  @Column({ name: 'permissionId' })
  permissionId!: string;

  @ManyToOne(
    type => Role,
    role => role.permissions,
  )
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(
    type => Permission,
    permission => permission.roles,
  )
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
