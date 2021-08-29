import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';

@Entity('sys_user_permission')
export class UserPermission {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => User, (user) => user.userPermissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Permission, (permission) => permission.userPermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
