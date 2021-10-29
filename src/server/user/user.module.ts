import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserinfoModule } from '../userinfo/userinfo.module';
import { UserGroupModule } from '../user-group/user-group.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { GroupModule } from '../group/group.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { AreaModule } from '../area/area.module';

@Global()
@Module({
  imports: [
    AreaModule,
    UserinfoModule,
    GroupModule,
    RoleModule,
    PermissionModule,
    UserGroupModule,
    UserRoleModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
