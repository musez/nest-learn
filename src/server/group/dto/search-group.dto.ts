import { PickType } from '@nestjs/swagger';
import { LimitGroupDto } from './limit-group.dto';

export class SearchGroupDto extends PickType(LimitGroupDto, [
  'name',
  'status',
]) {}
