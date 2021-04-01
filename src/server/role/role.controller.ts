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
import { BaseFindByIdDto } from '../base.dto';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchRoleDto } from './dto/search-role.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('role')
@ApiTags('角色')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
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
    return await this.roleService.deleteById(baseFindByIdDto);
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
