import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm'
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity('user_group_relational')
export class UserGroupRelational {
  @PrimaryGeneratedColumn('uuid', {
    comment: '主键 id',
  })
  id: string;

  @Column({ name: 'userId' })
  userId!: string

  @Column({ name: 'groupId' })
  groupId!: string

  @ManyToOne(
    type => User,
    user => user.groups,
  )
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(
    type => Group,
    group => group.users,
  )
  @JoinColumn({ name: 'groupId' })
  group: Group
}
