import { PickType } from '@nestjs/swagger';
import { LimitPostDto } from './limit-post.dto';

export class SearchPostDto extends PickType(LimitPostDto, ['name', 'status']) {}
