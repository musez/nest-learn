import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Group } from '../group/entities/group.entity';
import { LimitUserDto } from './dto/limit-user.dto';
import { BaseFindByIdDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { BindUserGroupDto } from './dto/bind-user-group.dto';
import { BindUserRoleDto } from '../user-role/dto/bind-user-role.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchUserDto } from './dto/search-user.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('用户')
@Controller('user')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post('add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    let { userName } = createUserDto;

    let isExistUserName = await this.userService.isExistUserName(userName);
    if (isExistUserName) {
      throw new BadRequestException(`用户名：${userName} 已存在！`);
    }

    return this.userService.insert(createUserDto, curUser);
  }

  @Get('findList')
  @Permissions('account:user:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchUserDto: SearchUserDto): Promise<User[]> {
    return await this.userService.selectList(searchUserDto);
  }

  @Get('findListPage')
  @Permissions('account:user:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitUserDto: LimitUserDto): Promise<any> {
    return await this.userService.selectListPage(limitUserDto);
  }

  @Get('findById')
  @Permissions('account:user:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    return await this.userService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Permissions('account:user:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    let { id } = updateUserDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.userService.update(updateUserDto, curUser);
  }

  @Post('updateStatus')
  @Permissions('account:user:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.userService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Permissions('account:user:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.userService.deleteById(baseFindByIdDto);
  }

  @Post('bindGroups')
  @Permissions('account:user:bindGroups')
  @ApiOperation({ summary: '绑定用户组' })
  async bindGroups(@CurUser() curUser, @Body() bindUserGroupDto: BindUserGroupDto): Promise<any> {
    let { id } = bindUserGroupDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.userService.bindGroups(bindUserGroupDto);
  }

  @Get('getGroups')
  @Permissions('account:user:getGroups')
  @ApiOperation({ summary: '获取用户组' })
  async findGroupsByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.userService.selectGroupsByUserId(baseFindByIdDto);
  }

  @Post('bindRoles')
  @Permissions('account:user:bindRoles')
  @ApiOperation({ summary: '绑定角色' })
  async bindRoles(@CurUser() curUser, @Body() bindUserRoleDto: BindUserRoleDto): Promise<any> {
    let { id } = bindUserRoleDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.userService.bindRoles(bindUserRoleDto);
  }

  @Get('getRoles')
  @Permissions('account:user:getRoles')
  @ApiOperation({ summary: '获取角色' })
  async findRolesByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;

    let isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.userService.selectRolesByUserId(baseFindByIdDto);
  }
}
