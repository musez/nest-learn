import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserinfoModule } from '../userinfo/userinfo.module';
import { UserGroupRelationalModule } from '../user-group-relational/user-group-relational.module';

@Module({
  imports: [UserinfoModule, UserGroupRelationalModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
