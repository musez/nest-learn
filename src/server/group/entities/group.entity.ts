import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { GroupRole } from '../../group-role/entities/group-role.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { GroupPermission } from '../../group-permission/entities/group-permission.entity';

@Entity('sys_group')
export class Group extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    // this.users = undefined;
    // this.roles = undefined;
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @OneToMany((type) => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @OneToMany((type) => GroupRole, (groupRole) => groupRole.group)
  groupRoles: GroupRole[];
}
