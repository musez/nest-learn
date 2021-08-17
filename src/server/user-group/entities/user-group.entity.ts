import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity('sys_user_group')
export class UserGroup {
  // constructor() {
  //   this.id = undefined;
  //   this.userId = undefined;
  //   this.groupId = undefined;
  //   this.user = undefined;
  //   this.group = undefined;
  // }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => User, (user) => user.userGroups)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Group, (group) => group.userGroups)
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
