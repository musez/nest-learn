import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { LimitPermissionDto } from './limit-permission.dto';

export class SearchPermissionDto extends PickType(LimitPermissionDto,
  ['parentId', 'kinship', 'name'],
) {
}
