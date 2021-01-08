import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupRoleRelationalDto } from './create-group-role-relational.dto';

export class UpdateGroupRoleRelationalDto extends PartialType(CreateGroupRoleRelationalDto) {}
