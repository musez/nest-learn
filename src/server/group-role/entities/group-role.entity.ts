import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('group_role')
export class GroupRole {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '用户组 id' })
  groupId!: string;

  @Column({ comment: '角色 id' })
  roleId!: string;

  @ManyToOne(type => Group, group => group.roles)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne(type => Role, role => role.groups)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
