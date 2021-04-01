import { Controller, Get, Post, Query, Body, UseGuards, BadRequestException } from '@nestjs/common';
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
import { BaseFindByIdDto, BaseFindByPIdDto, BasePageDto } from '../base.dto';
import { LimitPermissionDto } from './dto/limit-permission.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('permission')
@ApiTags('权限')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @Post('add')
  @Permissions('account:permission:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.insert(createPermissionDto, curUser);
  }

  @Get('findList')
  @Permissions('account:permission:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchPermissionDto: SearchPermissionDto) {
    return this.permissionService.selectList(searchPermissionDto);
  }

  @Get('findListPage')
  @Permissions('account:permission:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitPermissionDto: LimitPermissionDto) {
    return this.permissionService.selectListPage(limitPermissionDto);
  }

  @Get('findTree')
  @Permissions('account:permission:findTree')
  @ApiOperation({ summary: '获取树' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto) {
    return this.permissionService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Permissions('account:permission:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    return await this.permissionService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Permissions('account:permission:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updatePermissionDto: UpdatePermissionDto): Promise<any> {
    let { id } = updatePermissionDto;
    let isExistId = await this.permissionService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.permissionService.update(updatePermissionDto, curUser);
  }

  @Post('delete')
  @Permissions('account:permission:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.permissionService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.permissionService.deleteById(baseFindByIdDto);
  }
}
