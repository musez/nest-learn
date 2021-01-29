import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { LimitPermissionDto } from './limit-permission.dto';

export class SearchPermissionDto extends PickType(LimitPermissionDto,
  ['name', 'parentId'],
) {
}
