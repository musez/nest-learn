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

@ApiTags('用户')
@Controller('user')
@ApiBasicAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.insert(createUserDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchUserDto: SearchUserDto): Promise<User[]> {
    return await this.userService.selectList(searchUserDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitUserDto: LimitUserDto): Promise<any> {
    return await this.userService.selectListPage(limitUserDto);
  }

  @Get('findById')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<User> {
    return await this.userService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.update(updateUserDto, curUser);
  }

  @Post('modifyStatus')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改状态' })
  async modifyStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.userService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.userService.deleteById(baseFindByIdDto);
  }

  @Post('bindGroups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定用户组' })
  async bindGroups(@CurUser() curUser, @Body() bindUserGroupDto: BindUserGroupDto): Promise<any> {
    return await this.userService.bindGroups(bindUserGroupDto);
  }

  @Get('getGroups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户组' })
  async findGroupsByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.userService.selectGroupsByUserId(baseFindByIdDto);
  }

  @Post('bindRoles')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定用户组' })
  async bindRoles(@CurUser() curUser, @Body() bindUserRoleDto: BindUserRoleDto): Promise<any> {
    return await this.userService.bindRoles(bindUserRoleDto);
  }

  @Get('getRoles')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户组' })
  async findRolesByUserId(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.userService.selectRolesByUserId(baseFindByIdDto);
  }
}
