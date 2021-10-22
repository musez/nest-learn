import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Res, HttpStatus, Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseFindByIdDto, BaseFindByIdsDto, BasePageDto } from '../base.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { DictController } from '../dict/dict.controller';

@Controller('file')
@ApiTags('文件')
@ApiBasicAuth('token')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(
    private readonly fileService: FileService,
  ) {
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  findListPage(@Query() basePageDto: BasePageDto) {
    return this.fileService.selectListPage(basePageDto);
  }

  @Get('findById')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @ApiQuery({ name: 'id', description: '主键 id', required: true })
  findById(@Query() baseFindByIdDto: BaseFindByIdDto) {
    return this.fileService.selectById(baseFindByIdDto);
  }

  @Get('findFileUrl')
  @ApiOperation({ summary: '获取文件地址' })
  @ApiQuery({ name: 'id', description: '主键 id', required: true })
  async findFileUrl(@Query() baseFindByIdDto: BaseFindByIdDto, @Res() res) {
    try {
      const { mimeType, fileUrl } = await this.fileService.selectById(baseFindByIdDto);

      // 设置请求的返回头 type，content 的 type 类型列表见上面
      res.setHeader('Content-Type', mimeType);
      // 格式必须为 binary 否则会出错
      const content = fs.readFileSync(fileUrl, 'binary');
      res.writeHead(HttpStatus.OK, 'Ok');
      res.write(content, 'binary'); // 格式必须为 binary，否则会出错
      res.end();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('findByExtId')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:findByExtId')
  @ApiOperation({ summary: '获取列表（关联 extId）' })
  @ApiQuery({ name: 'extId', description: '关联 id', required: true })
  findByExtId(@Query('extId') extId: string) {
    return this.fileService.selectByExtId(extId);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:delete')
  @ApiOperation({ summary: '删除（主键 id）' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.fileService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.fileService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:file:deleteBatch')
  @ApiOperation({ summary: '删除（批量，主键 ids）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    try {
      return await this.fileService.deleteByIds(baseFindByIdsDto, curUser);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
