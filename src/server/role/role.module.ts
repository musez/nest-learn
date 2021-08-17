import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    PermissionModule,
    RolePermissionModule,
    TypeOrmModule.forFeature([Role]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
