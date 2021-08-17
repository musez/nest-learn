import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitOrgDto } from './limit-org.dto';

export class SearchOrgDto extends PickType(LimitOrgDto, [
  'parentId',
  'kinship',
  'name',
  'status',
]) {}
