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

@Controller('role')
@ApiTags('角色')
@ApiBasicAuth()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.insert(createRoleDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchRoleDto: SearchRoleDto): Promise<Role[]> {
    return await this.roleService.selectList(searchRoleDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitRoleDto: LimitRoleDto): Promise<any> {
    return await this.roleService.selectListPage(limitRoleDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    return await this.roleService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
