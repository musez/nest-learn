import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { Permission } from '../../permission/entities/permission.entity';

export class GroupPermission {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => Group, (group) => group.groupPermissions)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne((type) => Permission, (permission) => permission.groupPermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
