import { PickType } from '@nestjs/swagger';
import { LimitDictItemDto } from './limit-dict-item.dto';

export class SearchDictItemDto extends PickType(LimitDictItemDto, [
  'itemText',
  'dictId',
]) {}
