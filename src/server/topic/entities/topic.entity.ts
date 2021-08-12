import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { TopicType } from '../../../constants/dicts.enum';

@Entity('sys_topic')
export class Topic extends BaseEntity {
  constructor() {
    super();

    this.topicId = undefined;
    this.topicType = undefined;
    this.content = undefined;
    this.fromUid = undefined;
  }

  @Column('uuid', { comment: '主题 id' })
  topicId: string;

  @Column('tinyint', { comment: '主题类型（0：Article）'})
  topicType: TopicType;

  @Column('text', { comment: '评论内容', nullable: true })
  content: string;

  @Column('uuid', { comment: '评论用户 id' })
  fromUid: string;
}
