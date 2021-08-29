import { PickType } from '@nestjs/swagger';
import { LimitOrgDto } from './limit-org.dto';

export class SearchOrgDto extends PickType(LimitOrgDto, [
  'parentId',
  'kinship',
  'name',
  'status',
]) {}
