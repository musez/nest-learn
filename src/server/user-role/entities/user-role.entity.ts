import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity('sys_user_role')
export class UserRole {
  // constructor() {
  //   this.id = undefined;
  //   this.userId = undefined;
  //   this.roleId = undefined;
  // }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne(type => User, user => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(type => Role, role => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
