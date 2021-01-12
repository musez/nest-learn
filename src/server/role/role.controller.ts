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
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { BindRolePermissionDto } from './dto/bind-role-permission.dto';

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
  async add(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.insert(createRoleDto);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() query): Promise<Role[]> {
    return await this.roleService.selectList(query);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query('page', new ParseIntPipe()) page, @Query('limit', new ParseIntPipe()) limit, @Query() query: LimitRoleDto): Promise<any> {
    return await this.roleService.selectListPage(page, limit, query);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Role> {
    return await this.roleService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@Body() updateRoleDto: UpdateRoleDto): Promise<any> {
    return this.roleService.update(updateRoleDto);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.roleService.deleteById(baseFindByIdDto);
  }

  @Get('getPermissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取角色权限' })
  async findPermissionsByRoleId(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.roleService.selectPermissionsByRoleId(baseFindByIdDto);
  }

  @Post('bindPermissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定角色权限' })
  async bindPermissions(@Body() bindRolePermissionDto: BindRolePermissionDto): Promise<any> {
    return await this.roleService.bindPermissions(bindRolePermissionDto);
  }
}
