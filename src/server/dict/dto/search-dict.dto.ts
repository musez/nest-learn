import { PickType } from '@nestjs/swagger';
import { LimitDictDto } from './limit-dict.dto';

export class SearchDictDto extends PickType(LimitDictDto, [
  'dictName',
  'status',
]) {}
