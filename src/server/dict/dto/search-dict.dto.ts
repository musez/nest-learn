import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { LimitDictDto } from './limit-dict.dto';

export class SearchDictDto extends PickType(LimitDictDto, [
  'dictName',
  'status',
]) {}
