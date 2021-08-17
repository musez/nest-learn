import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { LimitRoleDto } from './limit-role.dto';

export class SearchRoleDto extends PickType(LimitRoleDto, ['name', 'status']) {}
