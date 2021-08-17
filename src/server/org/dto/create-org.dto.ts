import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseOrgDto } from './base-org.dto';

export class CreateOrgDto extends PickType(BaseOrgDto, [
  'parentId',
  'name',
  'shortName',
  'orgType',
  'orgLevel',
  'status',
  'description',
]) {}
