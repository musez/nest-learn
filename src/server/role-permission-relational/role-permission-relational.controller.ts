import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RolePermissionRelationalService } from './role-permission-relational.service';
import { CreateRolePermissionRelationalDto } from './dto/create-role-permission-relational.dto';
import { UpdateRolePermissionRelationalDto } from './dto/update-role-permission-relational.dto';

@Controller('role-permission-relational')
export class RolePermissionRelationalController {
  constructor(private readonly rolePermissionRelationalService: RolePermissionRelationalService) {}

  // @Post()
  // create(@Body() createRolePermissionRelationalDto: CreateRolePermissionRelationalDto) {
  //   return this.rolePermissionRelationalService.create(createRolePermissionRelationalDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.rolePermissionRelationalService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolePermissionRelationalService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateRolePermissionRelationalDto: UpdateRolePermissionRelationalDto) {
  //   return this.rolePermissionRelationalService.update(+id, updateRolePermissionRelationalDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolePermissionRelationalService.remove(+id);
  // }
}
