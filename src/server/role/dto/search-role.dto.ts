import {
  PickType,
} from '@nestjs/swagger';
import { LimitRoleDto } from './limit-role.dto';

export class SearchRoleDto extends PickType(LimitRoleDto, ['name', 'status']) {}
