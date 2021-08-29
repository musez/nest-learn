import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseDictDto } from './base-dict.dto';
import { CreateDictItemDto } from '../../dict-item/dto/create-dict-item.dto';

export class CreateDictDto extends PickType(BaseDictDto, [
  'dictCode',
  'dictName',
  'status',
  'description',
]) {
  @ApiPropertyOptional({
    description: '字典项',
    example: [{ itemText: '', itemValue: '', sort: 0 }],
  })
  dictItems?: CreateDictItemDto[];
}
