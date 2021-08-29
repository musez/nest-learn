import { Module } from '@nestjs/common';
import { GroupPermissionService } from './group-permission.service';
import { GroupPermissionController } from './group-permission.controller';
import { GroupPermission } from './entities/group-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GroupPermission])],
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService],
  exports: [GroupPermissionService],
})
export class GroupPermissionModule {}
