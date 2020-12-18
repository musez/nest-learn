import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserinfoService } from './userinfo.service';
import { UserinfoController } from './userinfo.controller';
import { Userinfo } from './entities/userinfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Userinfo])],
  controllers: [UserinfoController],
  providers: [UserinfoService]
})
export class UserinfoModule {}
