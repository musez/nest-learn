import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseFindByIdDto } from '../base.dto';

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
    return this.permissionService.insert(createPermissionDto);
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

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    return await this.permissionService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@Body() updatePermissionDto: UpdatePermissionDto): Promise<any> {
    return this.permissionService.update(updatePermissionDto);
  }
}
