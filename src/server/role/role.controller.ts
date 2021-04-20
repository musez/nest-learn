import {
  Controller,
  Get,
  Post,
  Req,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './entities/role.entity';
import { LimitRoleDto } from './dto/limit-role.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchRoleDto } from './dto/search-role.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('role')
@ApiTags('角色')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Permissions('account:role:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.insert(createRoleDto, curUser);
  }

  @Get('findList')
  @Permissions('account:role:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchRoleDto: SearchRoleDto): Promise<Role[]> {
    return await this.roleService.selectList(searchRoleDto);
  }

  @Get('findListPage')
  @Permissions('account:role:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitRoleDto: LimitRoleDto): Promise<any> {
    return await this.roleService.selectListPage(limitRoleDto);
  }

  @Get('findById')
  @Permissions('account:role:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    return await this.roleService.selectById(baseFindByIdDto);
  }

  @Get('export')
  @Permissions('account:role:export')
  @ApiOperation({ summary: '列表（导出）' })
  async export(@Query() searchRoleDto: SearchRoleDto, @Res() res): Promise<any> {
    let list = await this.roleService.selectList(searchRoleDto);

    let titleList = [
      { key: 'name', value: '名称' },
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
      'attachment; filename=' + encodeURIComponent(`角色_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Permissions('account:role:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateRoleDto: UpdateRoleDto): Promise<any> {
    let { id } = updateRoleDto;
    let isExistId = await this.roleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.roleService.update(updateRoleDto, curUser);
  }

  @Post('delete')
  @Permissions('account:role:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.roleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.roleService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Permissions('system:role:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.roleService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Get('getPermissions')
  @Permissions('account:role:getPermissions')
  @ApiOperation({ summary: '获取角色权限' })
  async findPermissionsByRoleId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.roleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.roleService.selectPermissionsByRoleId(baseFindByIdDto);
  }

  @Post('bindPermissions')
  @Permissions('account:role:bindPermissions')
  @ApiOperation({ summary: '绑定角色权限' })
  async bindPermissions(@CurUser() curUser, @Body() bindRolePermissionDto: BindRolePermissionDto): Promise<any> {
    let { id } = bindRolePermissionDto;
    let isExistId = await this.roleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.roleService.bindPermissions(bindRolePermissionDto);
  }
}
