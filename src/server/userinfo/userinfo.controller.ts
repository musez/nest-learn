import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiHeaders,
  ApiResponse,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { UserinfoService } from './userinfo.service';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';

@Controller('userinfo')
@ApiTags('用户信息')
@ApiBasicAuth()
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}

  // @Post()
  // create(@Body() createUserinfoDto: CreateUserinfoDto) {
  //   return this.userinfoService.create(createUserinfoDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.userinfoService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userinfoService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserinfoDto: UpdateUserinfoDto) {
  //   return this.userinfoService.update(+id, updateUserinfoDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userinfoService.remove(+id);
  // }
}
