import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,

  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DictItemService } from './dict-item.service';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';

@ApiTags('字典')
@Controller('dict-item')
export class DictItemController {
  constructor(private readonly dictItemService: DictItemService) {}

  // @Post()
  // create(@Body() createDictItemDto: CreateDictItemDto) {
  //   return this.dictItemService.create(createDictItemDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.dictItemService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dictItemService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateDictItemDto: UpdateDictItemDto) {
  //   return this.dictItemService.update(+id, updateDictItemDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dictItemService.remove(+id);
  // }
}
