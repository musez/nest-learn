import { PickType } from '@nestjs/swagger';
import { LimitTopicDto } from './limit-top.dto';

export class SearchTopicDto extends PickType(LimitTopicDto, [
  'topicId',
  'content',
  'topicType',
  'status',
  'isReply'
]) {}
