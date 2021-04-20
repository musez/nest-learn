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
import { BaseFindByIdDto, BaseFindByIdsDto, BasePageDto } from '../base.dto';
import { LimitGroupDto } from './dto/limit-group.dto';
import { SearchGroupDto } from './dto/search-group.dto';
import { BindGroupRoleDto } from '../group-role/dto/bind-group-role.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('group')
@ApiTags('用户组')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {
  }

  @Post('add')
  @Permissions('account:group:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.insert(createGroupDto, curUser);
  }

  @Get('findList')
  @Permissions('account:group:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchGroupDto: SearchGroupDto): Promise<Group[]> {
    return await this.groupService.selectList(searchGroupDto);
  }

  @Get('findListPage')
  @Permissions('account:group:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitGroupDto: LimitGroupDto): Promise<any> {
    return await this.groupService.selectListPage(limitGroupDto);
  }

  @Get('findById')
  @Permissions('account:group:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Group> {
    return await this.groupService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Permissions('account:group:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateGroupDto: UpdateGroupDto): Promise<any> {
    let { id } = updateGroupDto;
    let isExistId = await this.groupService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.groupService.update(updateGroupDto, curUser);
  }

  @Post('delete')
  @Permissions('account:group:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.groupService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.groupService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Permissions('system:group:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.groupService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Get('getRoles')
  @Permissions('account:group:getRoles')
  @ApiOperation({ summary: '获取用户组角色' })
  async findRolesByGroupId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.groupService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.groupService.selectRolesByGroupId(baseFindByIdDto);
  }

  @Post('bindRoles')
  @Permissions('account:group:bindRoles')
  @ApiOperation({ summary: '绑定用户组角色' })
  async bindRoles(@CurUser() curUser, @Body() bindGroupRoleDto: BindGroupRoleDto): Promise<any> {
    let { id } = bindGroupRoleDto;
    let isExistId = await this.groupService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.groupService.bindRoles(bindGroupRoleDto);
  }
}
