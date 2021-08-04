import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import dayjs = require('dayjs');
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        // 自定义路径
        destination: `./uploads/${dayjs().format('YYYY')}/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          // 自定义文件名
          // const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          // return cb(null, filename);
          return cb(null, dayjs().format('YYYYMMDDHHmmss') + '-' + file.originalname);
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {
}
