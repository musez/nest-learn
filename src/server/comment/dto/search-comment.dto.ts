import { PickType } from '@nestjs/swagger';
import { LimitCommentDto } from './limit-comment.dto';

export class SearchCommentDto extends PickType(LimitCommentDto, [
  'commentId',
  'content',
  'replyType',
  'status',
]) {}
