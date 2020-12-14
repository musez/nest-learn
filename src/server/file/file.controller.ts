import {
  Controller, Get, Post, Body, Query, Put, Param, Delete, UseInterceptors, UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@ApiTags('文件')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  UploadedFile(@UploadedFile() file, @Body() body) {
    const writeStream = createWriteStream(join(__dirname, '../../../', 'uploads', `${file.originalname}`));

    // 将 16 进制写入地址
    // writeStream.write(file.buffer);

    return this.fileService.insert(file, body);
  }

  @Post('uploads')
  // @ApiImplicitFile({
  //   name: 'file',
  //   description: '文件',
  //   required: true,
  // })
  // @ApiImplicitBody({
  //   name: 'description',
  //   description: '描述',
  //   required: true,
  // })
  // @ApiImplicitBody({
  //   name: 'extId',
  //   description: '关联 id',
  //   required: true,
  // })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
    { name: 'extId', maxCount: 1 },
    { name: 'description', maxCount: 1 },
  ]))
  UploadedFiles(@UploadedFiles() files, @Body() body) {
    console.log('UploadedFiles con');
    console.log(files);
    for (const file of files.files) {
      const writeStream = createWriteStream(join(__dirname, '../../../', 'uploads', `${file.originalname}`));
      // 将 16 进制写入地址
      // writeStream.write(file.buffer);
    }
    return this.fileService.batchInsert(files, body);
  }

  @Get('findById')
  @ApiQuery({
    name: 'id',
    description: '主键 id',
    required: false,
  })
  findById(@Query('id') id: string) {
    return this.fileService.selectById(id);
  }

  @Get('findByExtId')
  @ApiQuery({
    name: 'extId',
    description: '关联 id',
    required: false,
  })
  findByExtId(@Query('extId') extId: string) {
    return this.fileService.selectByExtId(extId);
  }

  // @Post()
  // create(@Body() createFileDto: CreateFileDto) {
  //   return this.fileService.create(createFileDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.fileService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.fileService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.fileService.update(+id, updateFileDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fileService.remove(+id);
  // }
}
