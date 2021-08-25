import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseQiniuDto } from './dto/base-qiniu.dto';

@ApiTags('七牛文件')
@Controller('qiniu')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {
  }

  @Post('upload')
  @ApiOperation({ summary: '文件上传（单）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '文件',
        },
        fileDisName: {
          type: 'string',
          description: '文件显示名称',
        },
        extId: {
          type: 'string',
          description: '关联 id',
        },
        description: {
          type: 'string',
          description: '描述',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@CurUser() curUser, @UploadedFile() file, @Body() body) {
    return await this.qiniuService.upload(file, curUser);
  }

  @Get('download')
  @ApiOperation({ summary: '下载' })
  async download(@Query() baseQiniuDto: BaseQiniuDto) {
    return await this.qiniuService.download(baseQiniuDto);
  }

  @Get('info')
  @ApiOperation({ summary: '文件信息' })
  async info(@Query() baseQiniuDto: BaseQiniuDto) {
    const ret = await this.qiniuService.info(baseQiniuDto);
    return ret;
  }
}
