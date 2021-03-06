import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { BasePermissionDto } from './base-permission.dto';

export class CreatePermissionDto extends PickType(BasePermissionDto,
  ['name', 'type', 'code', 'uri', 'parentId', 'status', 'description'],
) {
}
