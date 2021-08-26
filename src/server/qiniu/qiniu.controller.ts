import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Query, Res } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseQiniuDto } from './dto/base-qiniu.dto';
import fs from 'fs';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';

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
    if (Utils.isNil(file)) {
      throw new ApiException(`文件不能为空！`, 404);
    }

    return await this.qiniuService.upload(file, curUser);
  }

  @Get('download')
  @ApiOperation({ summary: '下载' })
  async download(@Query() baseQiniuDto: BaseQiniuDto, @Res() res) {
    return  await this.qiniuService.download(baseQiniuDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '文件信息' })
  async findById(@Query() baseQiniuDto: BaseQiniuDto) {
    // 根据 id 获取 key
    const ret = await this.qiniuService.selectByKey(baseQiniuDto);
    return ret;
  }
}
