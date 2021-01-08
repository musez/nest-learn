import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { GroupRoleRelationalService } from './group-role-relational.service';
import { CreateGroupRoleRelationalDto } from './dto/create-group-role-relational.dto';
import { UpdateGroupRoleRelationalDto } from './dto/update-group-role-relational.dto';

@Controller('group-role-relational')
export class GroupRoleRelationalController {
  constructor(private readonly groupRoleRelationalService: GroupRoleRelationalService) {}

  // @Post()
  // create(@Body() createGroupRoleRelationalDto: CreateGroupRoleRelationalDto) {
  //   return this.groupRoleRelationalService.create(createGroupRoleRelationalDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.groupRoleRelationalService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupRoleRelationalService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateGroupRoleRelationalDto: UpdateGroupRoleRelationalDto) {
  //   return this.groupRoleRelationalService.update(+id, updateGroupRoleRelationalDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupRoleRelationalService.remove(+id);
  // }
}
