import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  UploadedFiles,
  UseGuards, HttpStatus,
} from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BaseQiniuDto } from './dto/base-qiniu.dto';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { BaseFindByIdDto } from '../base.dto';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@ApiTags('七牛云')
@Controller('qiniu')
@ApiBasicAuth('token')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {
  }

  @Get('getToken')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:getToken')
  @ApiOperation({ summary: '获取 token' })
  async getToken() {
    return await this.qiniuService.createToken();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:upload')
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
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fieldSize: 8 * 1024 * 1024,
    },
  }))
  async upload(@CurUser() curUser, @UploadedFile() file, @Body() body) {
    try {
      if (Utils.isNil(file)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.qiniuService.upload(file, body, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('uploads')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:uploads')
  @ApiOperation({ summary: '文件上传（多）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
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
  @UseInterceptors(FileFieldsInterceptor([
    {
      name: 'files',
      maxCount: 10,
    },
    {
      name: 'fileDisName',
      maxCount: 10,
    },
    {
      name: 'extId',
      maxCount: 1,
    },
    {
      name: 'description',
      maxCount: 1,
    },
  ]))
  async uploads(@CurUser() curUser, @UploadedFiles() files, @Body() body) {
    try {
      if (Utils.isNil(files.files)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.qiniuService.uploads(files.files, body, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('findById')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:findById')
  @ApiOperation({ summary: '文件信息' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto) {
    return await this.qiniuService.selectById(baseFindByIdDto);
  }

  @Get('download')
  @ApiOperation({ summary: '下载' })
  async download(@Query() baseQiniuDto: BaseQiniuDto, @Res() res) {
    return await this.qiniuService.download(baseQiniuDto);
  }
}
