import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupRelationalService } from './user-group-relational.service';
import { UserGroupRelationalController } from './user-group-relational.controller';
import { UserGroupRelational } from './entities/user-group-relational.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupRelational])],
  controllers: [UserGroupRelationalController],
  providers: [UserGroupRelationalService],
  exports: [UserGroupRelationalService],
})
export class UserGroupRelationalModule {
}
