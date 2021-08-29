import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { GroupRoleModule } from '../group-role/group-role.module';
import { GroupPermissionModule } from '../group-permission/group-permission.module';

@Module({
  imports: [RoleModule, PermissionModule, GroupRoleModule, GroupPermissionModule, TypeOrmModule.forFeature([Group])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {
}
