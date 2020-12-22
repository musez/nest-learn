import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,

  ApiBasicAuth,
} from '@nestjs/swagger';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  // @Post()
  // create(@Body() createAreaDto: CreateAreaDto) {
  //   return this.areaService.create(createAreaDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.areaService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.areaService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
  //   return this.areaService.update(+id, updateAreaDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.areaService.remove(+id);
  // }

  // @Get('findTree')
  // findTree() {
  //   return this.areaService.selectTree();
  // }
}
