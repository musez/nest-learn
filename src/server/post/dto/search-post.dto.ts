import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitPostDto } from './limit-post.dto';

export class SearchPostDto extends PickType(LimitPostDto, ['name']) {
}

