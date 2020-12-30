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
  ApiParam,
  ApiHeader,
  ApiHeaders,
  ApiResponse,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserGroup } from './entities/user-group.entity';

@Controller('user-group')
@ApiTags('用户组')
@ApiBasicAuth()
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.userGroupService.insert(createUserGroupDto);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() query): Promise<UserGroup[]> {
    return await this.userGroupService.selectList(query);
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
    return await this.userGroupService.selectListPage(query);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<UserGroup> {
    return await this.userGroupService.selectById(id);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@Body() updateUserGroupDto: UpdateUserGroupDto): Promise<any> {
    return this.userGroupService.update(updateUserGroupDto);
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
    return await this.userGroupService.deleteById(id);
  }
}
