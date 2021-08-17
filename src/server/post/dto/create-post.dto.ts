import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BasePostDto } from './base-post.dto';

export class CreatePostDto extends PickType(BasePostDto, [
  'name',
  'sort',
  'status',
  'description',
]) {}
