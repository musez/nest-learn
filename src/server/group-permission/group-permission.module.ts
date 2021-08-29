import { Module } from '@nestjs/common';
import { GroupPermissionService } from './group-permission.service';
import { GroupPermissionController } from './group-permission.controller';

@Module({
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService]
})
export class GroupPermissionModule {}
