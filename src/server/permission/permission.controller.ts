import { Controller, Get, Post, Query, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@ApiTags('权限')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.insert(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionService.selectList();
  }

  @Get('findTree')
  findTree() {
    return this.permissionService.selectTree();
  }

  @Get('findTreeChild')
  @ApiQuery({
    name: 'parentId',
    description: '父 id',
    required: false,
  })
  findTreeChild(@Query('parentId') parentId: Permission) {
    return this.permissionService.selectTreeChild(parentId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permissionService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
  //   return this.permissionService.update(+id, updatePermissionDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.permissionService.remove(+id);
  // }
}
