import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
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
import { BaseFindByIdDto } from '../base.dto';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { BindUserGroupDto } from './dto/bind-user-group.dto';

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
  async add(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.insert(createUserDto);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() query): Promise<User[]> {
    return await this.userService.selectList(query);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query('page', new ParseIntPipe()) page, @Query('limit', new ParseIntPipe()) limit, @Query() limitUserDto: LimitUserDto): Promise<any> {
    return await this.userService.selectListPage(page, limit, limitUserDto);
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
  async modify(@Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.update(updateUserDto);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.userService.deleteById(baseFindByIdDto);
  }

  @Post('bindGroups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定用户组' })
  async bindGroups(@Body() bindUserGroupDto: BindUserGroupDto): Promise<any> {
    return await this.userService.bindGroups(bindUserGroupDto);
  }

  @Post('getGroups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户组' })
  async findGroupsByUserId(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.userService.selectGroupsByUserId(baseFindByIdDto);
  }
}
