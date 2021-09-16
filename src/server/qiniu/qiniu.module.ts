import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { QiniuController } from './qiniu.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [QiniuController],
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {
}
