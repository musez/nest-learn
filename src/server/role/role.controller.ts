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

@Controller('role')
@ApiTags('角色')
@ApiBasicAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {
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
  @ApiQuery({
    name: 'page',
    description: '第几页',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页条数',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    description: '名称',
    required: false,
  })
  @ApiQuery({
    name: 'mobile',
    description: '手机号',
    required: false,
  })
  async findListPage(@Query() query): Promise<any> {
    return await this.roleService.selectListPage(query);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<Role> {
    return await this.roleService.selectById(id);
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '主键 id',
        },
      },
    },
  })
  async remove(@Body('id') id: string): Promise<any> {
    return await this.roleService.deleteById(id);
  }
}
