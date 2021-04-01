import {
  Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { createWriteStream } from 'fs';

const fs = require('fs');
import { Utils } from './../../utils/index';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { CurUser } from '../../common/decorators/user.decorator';

@Controller('file')
@ApiTags('文件')
@ApiBasicAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
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
  upload(@CurUser() curUser, @UploadedFile() file, @Body() body) {
    if (Utils.isNil(file)) {
      throw new BadRequestException(`文件不能为空！`);
    }

    // const writeStream = createWriteStream(join(__dirname, '../../../', 'uploads', `${file.originalname}`));
    // 将 16 进制写入地址
    // writeStream.write(file.buffer);

    // 获取 body 中的文本参数
    let { description, extId } = body;
    let fileEntity = new File();

    fileEntity.extId = extId;
    fileEntity.description = description;
    fileEntity.originalName = file.originalname;
    fileEntity.encoding = file.encoding;
    fileEntity.mimeType = file.mimetype;
    fileEntity.destination = file.destination;
    fileEntity.fileName = file.filename;
    fileEntity.path = file.path;
    fileEntity.size = file.size;
    fileEntity.fileUrl = `${file.destination}/${file.filename}`;
    fileEntity.createBy = curUser.id;

    return this.fileService.insert(fileEntity, curUser);
  }

  @Post('uploads')
  @UseGuards(JwtAuthGuard)
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
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'files', maxCount: 10,
  }, {
    name: 'extId',
    maxCount: 1,
  }, {
    name: 'description', maxCount: 1,
  }]))
  uploads(@CurUser() curUser, @UploadedFiles() files, @Body() body) {
    if (Utils.isNil(files.files)) {
      throw new BadRequestException(`文件不能为空！`);
    }

    // 获取 body 中的文本参数
    let { description, extId } = body;
    let filesEntity = [];

    for (const file of files.files) {
      // const writeStream = createWriteStream(join(__dirname, '../../../', 'uploads', `${file.originalname}`));
      // 将 16 进制写入地址
      // writeStream.write(file.buffer);

      let fileEntity = new File();

      fileEntity.extId = extId;
      fileEntity.description = description;
      fileEntity.originalName = file.originalname;
      fileEntity.encoding = file.encoding;
      fileEntity.mimeType = file.mimetype;
      fileEntity.destination = file.destination;
      fileEntity.fileName = file.filename;
      fileEntity.path = file.path;
      fileEntity.size = file.size;
      fileEntity.fileUrl = `${file.destination}/${file.filename}`;
      fileEntity.createBy = curUser.id;

      filesEntity.push(fileEntity);
    }

    return this.fileService.batchInsert(filesEntity);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  findListPage(@Query() basePageDto: BasePageDto) {
    return this.fileService.selectListPage(basePageDto);
  }

  @Get('findById')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取文件（主键 id）' })
  @ApiQuery({ name: 'id', description: '主键 id', required: true })
  findById(@Query() baseFindByIdDto: BaseFindByIdDto) {
    return this.fileService.selectById(baseFindByIdDto);
  }

  @Get('findFileUrl')
  @ApiOperation({ summary: '获取文件地址' })
  @ApiQuery({ name: 'id', description: '主键 id', required: true })
  async findFileUrl(@Query() baseFindByIdDto: BaseFindByIdDto, @Res() res) {
    let file = await this.fileService.selectById(baseFindByIdDto);

    // 设置请求的返回头 type，content 的 type 类型列表见上面
    res.setHeader('Content-Type', file.mimeType);
    // 格式必须为 binary 否则会出错
    let content = fs.readFileSync(file.fileUrl, 'binary');
    res.writeHead(200, 'Ok');
    res.write(content, 'binary'); // 格式必须为 binary，否则会出错
    res.end();
  }

  @Get('findByExtId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取文件（关联 extId）' })
  @ApiQuery({ name: 'extId', description: '关联 id', required: true })
  findByExtId(@Query('extId') extId: string) {
    return this.fileService.selectByExtId(extId);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.fileService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.fileService.deleteById(baseFindByIdDto);
  }
}
