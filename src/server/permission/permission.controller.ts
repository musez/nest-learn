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
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { LimitPermissionDto } from './dto/limit-permission.dto';

@Controller('permission')
@ApiTags('权限')
@ApiBasicAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.insert(createPermissionDto);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  findList() {
    return this.permissionService.selectList();
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  findListPage(@Query('page', new ParseIntPipe()) page, @Query('limit', new ParseIntPipe()) limit, @Query() limitPermissionDto: LimitPermissionDto) {
    return this.permissionService.selectListPage(page, limit, limitPermissionDto);
  }

  @Get('findListByPId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（父 id）' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findListByPId(@Query('parentId') parentId: string) {
    return this.permissionService.selectListByPId(parentId);
  }

  @Get('findTree')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取树' })
  findTree() {
    return this.permissionService.selectTree();
  }

  @Get('findTreeByPId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取树（父 id）' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTreeByPId(@Query('parentId') parentId: string) {
    return this.permissionService.selectTreeByPId(parentId);
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
