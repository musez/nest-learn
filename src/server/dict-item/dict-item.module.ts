import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictItemService } from './dict-item.service';
import { DictItemController } from './dict-item.controller';
import { DictItem } from './entities/dict-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictItem])],
  controllers: [DictItemController],
  providers: [DictItemService],
  exports: [DictItemService],// 把这个服务抛出，给其他模块使用
})
export class DictItemModule {
}
