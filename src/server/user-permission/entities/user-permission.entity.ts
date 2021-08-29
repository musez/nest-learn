import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';

export class UserPermission {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => User, (user) => user.userPermissions)
  @JoinColumn({ name: 'groupId' })
  user: User;

  @ManyToOne((type) => Permission, (permission) => permission.userPermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
