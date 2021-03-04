import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { LimitMenuDto } from './limit-menu.dto';

export class SearchMenuDto extends PickType(LimitMenuDto,
  ['parentId', 'kinship', 'name'],
) {
}

