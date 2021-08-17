import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { LimitDictItemDto } from './limit-dict-item.dto';

export class SearchDictItemDto extends PickType(LimitDictItemDto, [
  'itemText',
  'dictId',
]) {}
