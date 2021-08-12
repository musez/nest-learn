import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitCommentDto } from './limit-comment.dto';

export class SearchCommentDto extends PickType(LimitCommentDto, ['commentId', 'content', 'replyType', 'status']) {
}
