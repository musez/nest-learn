import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QiniuService } from './qiniu.service';
import { QiniuController } from './qiniu.controller';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
const video = ['mp4', 'webm'];
const audio = ['mp3', 'wav', 'ogg'];

export const checkDirAndCreate = (filePath) => {
  const pathArr = filePath.split('/');
  let checkPath = '.';
  let item: string;
  for (item of pathArr) {
    checkPath += `/${item}`;
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
};

@Module({
  imports: [MulterModule.register({
    storage: diskStorage({
      // 配置文件上传后的文件夹路径
      destination: (req, file, cb) => {
        // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
        const mimeType = file.mimetype.split('/')[1];
        let temp = 'other';
        image.filter((item) => item === mimeType).length > 0
          ? (temp = 'image')
          : '';
        video.filter((item) => item === mimeType).length > 0
          ? (temp = 'video')
          : '';
        audio.filter((item) => item === mimeType).length > 0
          ? (temp = 'audio')
          : '';
        const filePath = `public/uploads/${temp}/${dayjs().format(
          'YYYY-MM-DD',
        )}`;
        checkDirAndCreate(filePath); // 判断文件夹是否存在，不存在则自动生成
        return cb(null, `./${filePath}`);
      },
      filename: (req, file, cb) => {
        // 在此处自定义保存后的文件名称
        const fileType = file.originalname.split('.');
        const filename = `${uuidv4()}.${fileType[fileType.length - 1]}`;
        return cb(null, filename);
      },
    }),
    fileFilter(req, file, cb) {
      const mimeType = file.mimetype.split('/')[1].toLowerCase();
      let temp = 'other';
      image.filter((item) => item === mimeType).length > 0
        ? (temp = 'image')
        : '';
      video.filter((item) => item === mimeType).length > 0
        ? (temp = 'video')
        : '';
      audio.filter((item) => item === mimeType).length > 0
        ? (temp = 'audio')
        : '';
      return cb(null, true);
    },
  })],
  controllers: [QiniuController],
  providers: [QiniuService],
})
export class QiniuModule {
}