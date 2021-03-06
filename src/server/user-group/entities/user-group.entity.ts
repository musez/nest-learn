import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity('user_group')
export class UserGroup {
  constructor() {
    this.id = undefined;
    this.userId = undefined;
    this.groupId = undefined;
    this.user = undefined;
    this.group = undefined;
  }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '用户 id' })
  userId!: string;

  @Column({ comment: '用户组 id' })
  groupId!: string;

  @ManyToOne(type => User, user => user.groups)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(type => Group, group => group.users)
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
