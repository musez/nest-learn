import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';

@Module({
  imports: [],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
