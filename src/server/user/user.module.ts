import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserinfoModule } from '../userinfo/userinfo.module';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  imports: [UserinfoModule, UserGroupModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
