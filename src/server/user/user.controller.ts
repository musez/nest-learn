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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import CryptoJS from 'crypto-js';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { UserinfoService } from '../userinfo/userinfo.service';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { LimitUserDto } from './dto/limit-user.dto';
import { BaseFindByIdDto } from '../base.dto';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';

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

  @Post('bindUserGroup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '绑定用户组' })
  async bindUserGroup(@Body() id: string, @Body('userGroups') userGroups: UserGroup[]): Promise<any> {
    return await this.userService.bindUserGroup(id, userGroups);
  }
}
