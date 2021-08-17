import { PickType } from '@nestjs/swagger';
import { BaseCommentDto } from './base-comment.dto';

export class CreateCommentDto extends PickType(BaseCommentDto, [
  'commentId',
  'replyId',
  'replyType',
  'content',
  'fromUid',
  'status',
  'description',
]) {}
