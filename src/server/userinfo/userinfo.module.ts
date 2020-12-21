import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserinfoService } from './userinfo.service';
import { UserinfoController } from './userinfo.controller';
import { Userinfo } from './entities/userinfo.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Userinfo])],
  controllers: [UserinfoController],
  providers: [UserinfoService],
  exports: [UserinfoService],// 把这个服务抛出，给其他模块使用
})
export class UserinfoModule {}
