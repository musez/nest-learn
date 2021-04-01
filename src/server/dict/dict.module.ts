import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { Dict } from './entities/dict.entity';
import { DictItemModule } from '../dict-item/dict-item.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, DictItemModule, TypeOrmModule.forFeature([Dict])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {
}
