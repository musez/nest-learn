import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserGroupRelationalService } from './user-group-relational.service';
import { CreateUserGroupRelationalDto } from './dto/create-user-group-relational.dto';
import { UpdateUserGroupRelationalDto } from './dto/update-user-group-relational.dto';

@Controller('user-group-relational')
export class UserGroupRelationalController {
  constructor(private readonly userGroupRelationalService: UserGroupRelationalService) {}

  // @Post()
  // create(@Body() createUserGroupRelationalDto: CreateUserGroupRelationalDto) {
  //   return this.userGroupRelationalService.create(createUserGroupRelationalDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.userGroupRelationalService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userGroupRelationalService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserGroupRelationalDto: UpdateUserGroupRelationalDto) {
  //   return this.userGroupRelationalService.update(+id, updateUserGroupRelationalDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userGroupRelationalService.remove(+id);
  // }
}
