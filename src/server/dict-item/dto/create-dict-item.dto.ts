import { PickType } from '@nestjs/swagger';
import { BaseDictItemDto } from './base-dict-item.dto';

export class CreateDictItemDto extends PickType(BaseDictItemDto, [
  'itemText',
  'itemValue',
  'sort',
]) {}
