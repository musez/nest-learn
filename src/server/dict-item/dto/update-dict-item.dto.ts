import { PickType } from '@nestjs/mapped-types';
import { BaseDictItemDto } from './base-dict-item.dto';

export class UpdateDictItemDto extends PickType(BaseDictItemDto, [
  'id',
  'itemText',
  'itemValue',
  'sort',
]) {}
