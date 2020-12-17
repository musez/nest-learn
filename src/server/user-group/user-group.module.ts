import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { UserGroup } from './entities/user-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup])],
  controllers: [UserGroupController],
  providers: [UserGroupService]
})
export class UserGroupModule {}
