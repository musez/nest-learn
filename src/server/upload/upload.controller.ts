import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile, HttpStatus, UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseFilesUploadDto, BaseFileUploadDto } from './dto/file-upload.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { FileService } from '../file/file.service';
import { QiniuService } from '../qiniu/qiniu.service';

@Controller('upload')
@ApiTags('上传')
@ApiBasicAuth('token')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService,
    private readonly qiniuService: QiniuService,
  ) {}

  @Post('file/upload')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:upload')
  @ApiOperation({ summary: '文件上传（单）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BaseFileUploadDto, description: '文件' })
  @UseInterceptors(FileInterceptor('file'))
  fileUpload(@CurUser() curUser, @UploadedFile() file, @Body() body) {
    try {
      if (Utils.isNil(file)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.fileService.insert(file, body, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('file/uploads')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:uploads')
  @ApiOperation({ summary: '文件上传（批量）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BaseFilesUploadDto, description: '文件' })
  @UseInterceptors(
    FileFieldsInterceptor([
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
    ]),
  )
  fileUploads(@CurUser() curUser, @UploadedFiles() files, @Body() body) {
    try {
      if (Utils.isNil(files.files)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.fileService.insertBatch(files.files, body, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('qiniu/upload')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:upload')
  @ApiOperation({ summary: '文件上传（单）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BaseFileUploadDto, description: '文件' })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fieldSize: 8 * 1024 * 1024,
    },
  }))
  async qiniuUpload(@CurUser() curUser, @UploadedFile() file, @Body() body) {
    try {
      if (Utils.isNil(file)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.qiniuService.upload(file, body, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('qiniu/uploads')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:uploads')
  @ApiOperation({ summary: '文件上传（多）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BaseFilesUploadDto, description: '文件' })
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
  async qiniuUploads(@CurUser() curUser, @UploadedFiles() files, @Body() body) {
    try {
      if (Utils.isNil(files.files)) {
        throw new ApiException(`文件不能为空！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.qiniuService.uploads(files.files, body, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
