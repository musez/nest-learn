import { Module } from '@nestjs/common';
import { RolePermissionRelationalService } from './role-permission-relational.service';
import { RolePermissionRelationalController } from './role-permission-relational.controller';

@Module({
  controllers: [RolePermissionRelationalController],
  providers: [RolePermissionRelationalService]
})
export class RolePermissionRelationalModule {}
