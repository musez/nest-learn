import { Controller, Get, Post, Query, Body, UseGuards, BadRequestException, Res } from '@nestjs/common';
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
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto, BasePageDto } from '../base.dto';
import { LimitPermissionDto } from './dto/limit-permission.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { SearchRoleDto } from '../role/dto/search-role.dto';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('permission')
@ApiTags('权限')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('account:permission:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.insert(createPermissionDto, curUser);
  }

  @Get('findList')
  @Auth('account:permission:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchPermissionDto: SearchPermissionDto) {
    return this.permissionService.selectList(searchPermissionDto);
  }

  @Get('findListPage')
  @Auth('account:permission:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitPermissionDto: LimitPermissionDto) {
    return this.permissionService.selectListPage(limitPermissionDto);
  }

  @Get('findTree')
  @Auth('account:permission:findTree')
  @ApiOperation({ summary: '获取树' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto) {
    return this.permissionService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Auth('account:permission:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    return await this.permissionService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:permission:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchPermissionDto: SearchPermissionDto, @Res() res): Promise<any> {
    const list = await this.permissionService.selectList(searchPermissionDto);

    const columns = [
      { key: 'name', name: '名称', type: 'String', size: 10 },
      { key: 'type', name: '权限类型', type: 'String', size: 10 },
      { key: 'code', name: '权限 CODE 代码', type: 'String', size: 10 },
      { key: 'routerComponent', name: '路由 component', type: 'String', size: 10 },
      { key: 'routerHidden', name: '路由 hidden', type: 'String', size: 10 },
      { key: 'routerIcon', name: '路由 icon', type: 'String', size: 10 },
      { key: 'sort', name: '权限 sort', type: 'String', size: 10 },
      { key: 'routerPath', name: '路由 path', type: 'String', size: 10 },
      { key: 'status', name: '状态', type: 'String', size: 10 },
      { key: 'description', name: '备注', type: 'String', size: 20 },
      { key: 'createTime', name: '创建时间', type: 'String', size: 20 },
      { key: 'updateTime', name: '修改时间', type: 'String', size: 20 },
    ];
    const result = await this.excelService.exportExcel(columns, list);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats;charset=utf-8',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent(`权限_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('account:permission:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updatePermissionDto: UpdatePermissionDto): Promise<any> {
    const { id } = updatePermissionDto;
    const isExistId = await this.permissionService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.permissionService.update(updatePermissionDto, curUser);
  }

  @Post('delete')
  @Auth('account:permission:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.permissionService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.permissionService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:permission:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.permissionService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
