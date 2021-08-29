import { PickType } from '@nestjs/swagger';
import { BaseRoleDto } from './base-role.dto';

export class CreateRoleDto extends PickType(BaseRoleDto, [
  'name',
  'status',
  'description',
]) {}
