import {
  Controller,
  Get,
  Post,
  Req,
  Request,
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
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Group } from './entities/group.entity';
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { LimitGroupDto } from './dto/limit-group.dto';
import { BindUserGroupDto } from '../user/dto/bind-user-group.dto';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';

@Controller('group')
@ApiTags('用户组')
@ApiBasicAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.insert(createGroupDto);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() query): Promise<Group[]> {
    return await this.groupService.selectList(query);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query('page', new ParseIntPipe()) page, @Query('limit', new ParseIntPipe()) limit, @Query() limitGroupDto: LimitGroupDto): Promise<any> {
    return await this.groupService.selectListPage(page, limit, limitGroupDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<Group> {
    return await this.groupService.selectById(id);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@Body() updateGroupDto: UpdateGroupDto): Promise<any> {
    return this.groupService.update(updateGroupDto);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.groupService.deleteById(baseFindByIdDto);
  }

  @Get('getRoles')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户组角色' })
  async findRolesByGroupId(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.groupService.selectRolesByGroupId(baseFindByIdDto);
  }

  @Post('bindRoles')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定用户组角色' })
  async bindRoles(@Body() bindGroupRoleDto: BindGroupRoleDto): Promise<any> {
    return await this.groupService.bindRoles(bindGroupRoleDto);
  }
}
