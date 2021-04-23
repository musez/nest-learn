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
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { SearchRoleDto } from '../role/dto/search-role.dto';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('permission')
@ApiTags('权限')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly excelService: ExcelService,
  ) {
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

  @Get('exportExcel')
  @Permissions('account:permission:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchPermissionDto: SearchPermissionDto, @Res() res): Promise<any> {
    let list = await this.permissionService.selectList(searchPermissionDto);

    let titleList = [
      { key: 'name', value: '名称' },
      { key: 'type', value: '权限类型' },
      { key: 'code', value: '权限 CODE 代码' },
      { key: 'routerComponent', value: '路由 component' },
      { key: 'routerHidden', value: '路由 hidden' },
      { key: 'routerIcon', value: '路由 icon' },
      { key: 'sort', value: '权限 sort' },
      { key: 'routerPath', value: '路由 path' },
      { key: 'status', value: '状态' },
      { key: 'description', value: '备注' },
      { key: 'createTime', value: '创建时间' },
      { key: 'updateTime', value: '修改时间' },
    ];
    const result = this.excelService.exportExcel(titleList, list);

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
    return await this.permissionService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Permissions('system:permission:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.permissionService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
