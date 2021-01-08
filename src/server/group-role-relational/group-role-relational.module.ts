import { Module } from '@nestjs/common';
import { GroupRoleRelationalService } from './group-role-relational.service';
import { GroupRoleRelationalController } from './group-role-relational.controller';

@Module({
  controllers: [GroupRoleRelationalController],
  providers: [GroupRoleRelationalService]
})
export class GroupRoleRelationalModule {}
