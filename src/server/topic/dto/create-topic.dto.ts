import { PickType } from '@nestjs/swagger';
import { BaseTopicDto } from './base-topic.dto';

export class CreateTopicDto extends PickType(BaseTopicDto, [
  'topicId',
  'topicType',
  'content',
  'fromUid',
  'status',
  'description',
]) {}
