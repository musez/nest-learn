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

  // 表示回复目标的 id，如果 replyType 是 comment 的话，那么 replyId = commentId，如果 replyType 是 reply 的话，这表示这条回复的父回复
  @Column('uuid', {
    comment:
      '回复目标 id。如果 replyType 是 comment 的话，那么 replyId = commentId，如果 replyType 是 reply 的话，这表示这条回复的父回复',
  })
  replyId: string;

  // 表示回复的类型，因为回复可以是针对评论的回复（comment），也可以是针对回复的回复（reply）， 通过这个字段来区分两种情景
  @Column('tinyint', {
    comment:
      '回复类型（0：评论；1：回复）。因为回复可以是针对评论的回复（comment），也可以是针对回复的回复（reply）， 通过这个字段来区分两种情景',
  })
  replyType: ReplyType;

  @Column('text', { comment: '回复内容', nullable: true })
  content: string;

  @Column('uuid', { comment: '回复用户 id' })
  fromUid: string;

  @Column('uuid', { comment: '目标用户 id' })
  toUid: string;
}
