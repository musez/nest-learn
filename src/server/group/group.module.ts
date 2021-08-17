import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { GroupRoleModule } from '../group-role/group-role.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule, GroupRoleModule, TypeOrmModule.forFeature([Group])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
