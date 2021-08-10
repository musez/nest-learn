import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ReplyType } from '../../../constants/dicts.enum';

@Entity('sys_comment')
export class Comment extends BaseEntity {
  constructor() {
    super();

    this.commentId = undefined;
    this.replyId = undefined;
    this.replyType = undefined;
    this.content = undefined;
    this.fromUid = undefined;
    this.toUid = undefined;
  }

  @Column('uuid', { comment: '评论 id' })
  commentId: string;

  @Column('uuid', { comment: '回复目标 id' })
  replyId: string;

  @Column('tinyint', { comment: '回复类型' })
  replyType: ReplyType;

  @Column('text', { comment: '回复内容' })
  content: string;

  @Column('uuid', { comment: '回复用户 id' })
  fromUid: string;

  @Column('uuid', { comment: '目标用户 id' })
  toUid: string;
}
