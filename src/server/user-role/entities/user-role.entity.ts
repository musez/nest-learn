import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity('user_role')
export class UserRole {
  constructor() {
    this.id = undefined;
    this.userId = undefined;
    this.roleId = undefined;
  }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '用户 id' })
  userId!: string;

  @Column({ comment: '角色 id' })
  roleId!: string;

  @ManyToOne(type => User, user => user.roles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(type => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
