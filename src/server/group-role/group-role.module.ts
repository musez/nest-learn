import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { GroupRole } from './entities/group-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRole])],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
  exports: [GroupRoleService],
})
export class GroupRoleModule {
}
