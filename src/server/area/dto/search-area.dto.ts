import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitAreaDto } from './limit-area.dto';

export class SearchAreaDto extends PickType(LimitAreaDto, [
  'parentId',
  'areaName',
]) {}
