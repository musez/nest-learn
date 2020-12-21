import { Controller, Get, Post, Query, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiHeaders,
  ApiResponse,
  ApiBasicAuth,
  ApiOperation
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('permission')
@ApiTags('权限')
@ApiBasicAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@Body() createPermissionDto: CreatePermissionDto) {
    let { parentId, ...result } = createPermissionDto;

    let child = new Permission();
    for (let key in result) {
      child[key] = result[key];
    }

    let parent = await this.permissionService.findOne(parentId);
    if (parent) {
      child.parent = parent;
    }

    return this.permissionService.insert(child);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  findList() {
    return this.permissionService.selectList();
  }

  @Get('findTree')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取树（多层级）' })
  findTree() {
    return this.permissionService.selectTree();
  }

  @Get('findTreeChild')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取树（单层级）' })
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
