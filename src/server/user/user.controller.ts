import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LimitUserDto } from './dto/limit-user.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { BindUserGroupDto } from '../user-group/dto/bind-user-group.dto';
import { BindUserRoleDto } from '../user-role/dto/bind-user-role.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchUserDto } from './dto/search-user.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ExcelService } from '../excel/excel.service';
import { Utils } from './../../utils/index';
import { SexDict, StatusDict, UserDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';
import { BindUserPermissionDto } from '../user-permission/dto/bind-user-permission.dto';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { ImportType } from '../../constants/dicts.enum';
import { ImportLogService } from '../import-log/import-log.service';

@ApiTags('用户')
@Controller('user')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly excelService: ExcelService,
    private readonly importLogService: ImportLogService,
  ) {
  }

  @Post('add')
  @Auth('account:user:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createUserDto: CreateUserDto): Promise<CreateUserDto | void> {
    try {
      const { userName } = createUserDto;
      const isExistUserName = await this.userService.isExistUserName(userName);
      if (isExistUserName) {
        throw new ApiException(`用户名：${userName} 已存在！`, ApiErrorCode.USER_NAME_EXISTS, HttpStatus.OK);
      }

      return this.userService.insert(createUserDto, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('findList')
  @Auth('account:user:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchUserDto: SearchUserDto): Promise<User[]> {
    return await this.userService.selectList(searchUserDto);
  }

  @Get('findListPage')
  @Auth('account:user:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitUserDto: LimitUserDto): Promise<any> {
    return await this.userService.selectListPage(limitUserDto);
  }

  @Get('findById')
  @Auth('account:user:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    return await this.userService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:user:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchUserDto: SearchUserDto, @Res() res): Promise<any> {
    try {
      const list = await this.userService.selectList(searchUserDto);

      list.forEach((v) => {
        if (v.userinf) {
          v.provinceId = v.userinfo.provinceId;
          v.cityId = v.userinfo.cityId;
          v.districtId = v.userinfo.districtId;
          v.address = v.userinfo.address;
        }
      });

      const columns = [
        { key: 'userName', name: '用户名', type: 'String', size: 10 },
        { key: 'userType', name: '用户类型', type: 'Enum', size: 10, default: UserDict },
        { key: 'name', name: '姓名', type: 'String', size: 10 },
        { key: 'mobile', name: '手机号', type: 'String', size: 15 },
        { key: 'email', name: '邮箱', type: 'String', size: 15 },
        { key: 'sex', name: '性别', type: 'Enum', size: 10, default: SexDict },
        { key: 'birthday', name: '生日', type: 'String', size: 15 },
        { key: 'provinceId', name: '省份', type: 'String', size: 15 },
        { key: 'cityId', name: '城市', type: 'String', size: 15 },
        { key: 'districtId', name: '区/县', type: 'String', size: 15 },
        { key: 'address', name: '详细地址', type: 'String', size: 30 },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusDict },
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
        encodeURIComponent(`用户_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('importExcel')
  @Auth('account:user:importExcel')
  @ApiOperation({ summary: '列表（Excel 导入）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '文件',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@CurUser() curUser, @UploadedFile() file): Promise<any> {
    try {
      const columns = [
        { key: 'userName', name: '用户名', type: 'String', index: 1 },
        { key: 'userType', name: '用户类型', type: 'Enum', enum: UserDict, index: 2 },
        { key: 'name', name: '姓名', type: 'String', index: 3 },
        { key: 'mobile', name: '手机号', type: 'String', index: 4 },
        { key: 'email', name: '邮箱', type: 'String', index: 5 },
        { key: 'sex', name: '性别', type: 'Enum', enum: SexDict, index: 6 },
        { key: 'birthday', name: '生日', type: 'Date', format: 'YYYY-MM-DD', index: 7 },
        { key: 'provinceId', name: '省份', type: 'String', size: 15, index: 8 },
        { key: 'cityId', name: '城市', type: 'String', size: 15, index: 9 },
        { key: 'districtId', name: '区/县', type: 'String', size: 15, index: 10 },
        { key: 'address', name: '详细地址', type: 'String', size: 30, index: 11 },
        { key: 'status', name: '状态', type: 'Enum', enum: StatusDict, index: 12 },
        { key: 'description', name: '备注', type: 'String', index: 13 },
      ];

      const rows = await this.excelService.importExcel(columns, file);
      const successRows = [],
        errorRows = [];

      for (const item of rows) {
        const { userName } = item;
        const ret = await this.userService.isExistUserName(userName);
        if (ret) {
          item.errorMsg = `数据 userName：${userName} 已存在！`;
          errorRows.push(item);
          continue;
        }

        successRows.push(item);
      }

      const ret = await this.userService.insertBatch(successRows, curUser);
      const retLog = await this.importLogService.insert({
        importType: ImportType.USER,
        successCount: successRows.length,
        successData: successRows.length ? JSON.stringify(successRows) : null,
        errorCount: errorRows.length,
        errorData: errorRows.length ? JSON.stringify(errorRows) : null,
      }, curUser);

      if (ret && retLog) {
        return {
          successList: successRows,
          successCount: ret.length,
          errorList: errorRows,
          errorCount: ret.length,
        };
      } else {
        throw new ApiException(`操作异常！`, ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('update')
  @Auth('account:user:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { id } = updateUserDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.userService.update(updateUserDto, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('account:user:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.userService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('account:user:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.userService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('system:user:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.userService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Post('bindGroups')
  @Auth('account:user:bindGroups')
  @ApiOperation({ summary: '绑定用户组' })
  async bindGroups(@CurUser() curUser, @Body() bindUserGroupDto: BindUserGroupDto): Promise<any> {
    try {
      const { id } = bindUserGroupDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return await this.userService.bindGroups(bindUserGroupDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getGroups')
  @Auth('account:user:getGroups')
  @ApiOperation({ summary: '获取用户组' })
  async findGroupsByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return await this.userService.selectGroupsByUserId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('bindRoles')
  @Auth('account:user:bindRoles')
  @ApiOperation({ summary: '绑定角色' })
  async bindRoles(@CurUser() curUser, @Body() bindUserRoleDto: BindUserRoleDto): Promise<any> {
    try {
      const { id } = bindUserRoleDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return await this.userService.bindRoles(bindUserRoleDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getRoles')
  @Auth('account:user:getRoles')
  @ApiOperation({ summary: '获取角色' })
  async findRolesByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.userService.selectRolesByUserId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('bindPermissions')
  @Auth('account:user:bindPermissions')
  @ApiOperation({ summary: '绑定权限' })
  async bindPermissions(@CurUser() curUser, @Body() bindUserPermissionDto: BindUserPermissionDto): Promise<any> {
    try {
      const { id } = bindUserPermissionDto;
      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return await this.userService.bindPermissions(bindUserPermissionDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getPermissions')
  @Auth('account:user:getPermissions')
  @ApiOperation({ summary: '获取权限' })
  async findPermissionsByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.userService.selectPermissionsByUserId(baseFindByIdDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
