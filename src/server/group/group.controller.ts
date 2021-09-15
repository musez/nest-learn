import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Res, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Group } from './entities/group.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { LimitGroupDto } from './dto/limit-group.dto';
import { SearchGroupDto } from './dto/search-group.dto';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { StatusDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';
import { BindGroupPermissionDto } from '../group-permission/dto/bind-group-premission.dto';
import { GroupPermissionService } from '../group-permission/group-permission.service';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Controller('group')
@ApiTags('用户组')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly excelService: ExcelService,
    private readonly groupPermissionService: GroupPermissionService,
  ) {
  }

  @Post('add')
  @Auth('account:group:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.insert(createGroupDto, curUser);
  }

  @Get('findList')
  @Auth('account:group:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchGroupDto: SearchGroupDto): Promise<Group[]> {
    return await this.groupService.selectList(searchGroupDto);
  }

  @Get('findListPage')
  @Auth('account:group:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitGroupDto: LimitGroupDto): Promise<any> {
    return await this.groupService.selectListPage(limitGroupDto);
  }

  @Get('findById')
  @Auth('account:group:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    return await this.groupService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:group:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchGroupDto: SearchGroupDto, @Res() res): Promise<any> {
    try {
      const list = await this.groupService.selectList(searchGroupDto);

      const columns = [
        { key: 'name', name: '名称', type: 'String', size: 10 },
        {
          key: 'status',
          name: '状态',
          type: 'Enum',
          size: 10,
          default: StatusDict,
        },
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
        'attachment; filename=' +
        encodeURIComponent(`用户组_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('update')
  @Auth('account:group:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateGroupDto: UpdateGroupDto): Promise<any> {
    try {
      const { id } = updateGroupDto;
      const isExistId = await this.groupService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.groupService.update(updateGroupDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('account:group:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.groupService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('account:group:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.groupService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.groupService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('system:group:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.groupService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Post('bindRoles')
  @Auth('account:group:bindRoles')
  @ApiOperation({ summary: '绑定用户组角色' })
  async bindRoles(@CurUser() curUser, @Body() bindGroupRoleDto: BindGroupRoleDto): Promise<any> {
    try {
      const { id } = bindGroupRoleDto;
      const isExistId = await this.groupService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.groupService.bindRoles(bindGroupRoleDto);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getRoles')
  @Auth('account:group:getRoles')
  @ApiOperation({ summary: '获取用户组角色' })
  async findRolesByGroupId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.groupService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.groupService.selectRolesByGroupId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('bindPermissions')
  @Auth('account:group:bindPermissions')
  @ApiOperation({ summary: '绑定权限' })
  async bindPermissions(@CurUser() curUser, @Body() bindGroupPermissionDto: BindGroupPermissionDto): Promise<any> {
    try {
      const { id } = bindGroupPermissionDto;

      const isExistId = await this.groupService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return await this.groupService.bindPermissions(bindGroupPermissionDto);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getPermissions')
  @Auth('account:group:getPermissions')
  @ApiOperation({ summary: '获取权限' })
  async findPermissionsByGroupId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.groupService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.groupService.selectPermissionsByGroupId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
