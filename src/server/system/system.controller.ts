import {
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const fs = require('fs');
const path = require('path');

@ApiTags('系统信息')
@Controller('system')
export class SystemController {
  private json = [];
  private myDir = 'E:/phpstudy_pro/WWW/vue-admin-template';

  @Post('file')
  @ApiOperation({ summary: '文件' })
  async file(): Promise<any> {
    await this.readFile(this.myDir);

    return this.json;
  }

  /**
   * 遍历文件夹下的所有文件，最后输出文件夹下所有的文件名
   * 思路 使用 fs，path 模块
   * 1、先读取文件夹，获取文件的所有文件
   * 2、对获取的文件进行遍历，用 fs.stat 获得文件状态，
   * 3、通过状态中的 stat.isFile() 判断是否是一个文件，是文件直接输出文件名，不是文件就继续递归。
   */
  async readFile(myUrl): Promise<any> {
    fs.readdir(myUrl, (err, files) => {
      if (err) throw err;
      files.forEach((file, index) => {
        if (
          file !== '.git' &&
          file !== '.idea' &&
          file !== 'node_modules' &&
          file !== 'dist'
        ) {
          // 拼接获取绝对路径，fs.stat(绝对路径,回调函数)
          const fPath = path.join(myUrl, file);
          fs.stat(fPath, (err, stat) => {
            const list = {
              name: file,
              type: null,
            };

            if (stat.isFile()) {
              // stat 状态中有两个函数一个是 stat 中有 isFile ,isisDirectory 等函数进行判断是文件还是文件夹
              list.type = 'file';
              this.json.push(list);
            } else {
              list.type = 'dir';
              this.json.push(list);
            }
          });
        }
      });
    });
  }

  @Post('info')
  @ApiOperation({ summary: '服务器信息' })
  async info(@Req() req): Promise<any> {
    const connection = req.connection;

    return {
      remoteAddress: connection.remoteAddress,
      remotePort: connection.remotePort,
      localAddress: connection.localAddress,
      localPort: connection.localPort,
    };
  }
}
