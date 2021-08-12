import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitTopicDto } from './limit-top.dto';

export class SearchTopicDto extends PickType(LimitTopicDto, ['topicId', 'content', 'topicType', 'status']) {
}
