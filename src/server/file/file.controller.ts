import {
  Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@ApiTags('文件')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {
  }

  @Post('upload')
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
  UploadedFile(@UploadedFiles() files, @Body() body) {
    return this.fileService.insert(files, body);
  }

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
