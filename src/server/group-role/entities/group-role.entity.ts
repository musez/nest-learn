import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
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

  @ManyToOne(type => Group, group => group.groupRoles)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne(type => Role, role => role.groupRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
