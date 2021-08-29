import { PickType } from '@nestjs/swagger';
import { LimitAreaDto } from './limit-area.dto';

export class SearchAreaDto extends PickType(LimitAreaDto, [
  'parentId',
  'areaName',
]) {}
