import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictItemService } from './dict-item.service';
import { DictItemController } from './dict-item.controller';
import { DictItem } from './entities/dict-item.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([DictItem])],
  controllers: [DictItemController],
  providers: [DictItemService],
  exports: [DictItemService],// 把这个服务抛出，给其他模块使用
})
export class DictItemModule {
}
