import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity('user_role')
export class UserRole {
  @PrimaryGeneratedColumn('uuid', {
    comment: '主键 id',
  })
  id: string;

  @Column({ name: 'userId' })
  userId!: string;

  @Column({ name: 'roleId' })
  roleId!: string;

  @ManyToOne(
    type => User,
    user => user.roles,
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(
    type => Role,
    role => role.users,
  )
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
