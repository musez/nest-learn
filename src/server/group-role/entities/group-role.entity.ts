import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne, Column,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('sys_group_role')
export class GroupRole {
  // constructor() {
  //   this.id = undefined;
  //   this.groupId = undefined;
  //   this.roleId = undefined;
  // }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => Group, (group) => group.groupRoles)
  // @JoinColumn({ name: 'groupId' })
  @JoinColumn()
  group: Group;

  @Column('uuid', { comment: '用户组 id', nullable: true })
  groupId: string;

  @ManyToOne((type) => Role, (role) => role.groupRoles)
  // @JoinColumn({ name: 'roleId' })
  @JoinColumn()
  role: Role;

  @Column('uuid', { comment: '角色 id', nullable: true })
  roleId: string;
}
