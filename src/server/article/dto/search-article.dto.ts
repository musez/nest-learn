import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { LimitArticleDto } from './limit-article.dto';

export class SearchArticleDto extends PickType(LimitArticleDto, [
  'title',
  'type',
  'status',
  'catId',
]) {}
