import { PartialType } from '@nestjs/mapped-types';
import { CreateRolePermissionRelationalDto } from './create-role-permission-relational.dto';

export class UpdateRolePermissionRelationalDto extends PartialType(CreateRolePermissionRelationalDto) {}
