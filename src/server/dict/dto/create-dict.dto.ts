import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseDictDto } from './base-dict.dto';

export class CreateDictDto extends PickType(BaseDictDto,
  ['dictCode', 'dictName', 'dictItems', 'status', 'description']) {
}
