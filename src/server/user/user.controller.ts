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
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { UserinfoService } from '../userinfo/userinfo.service';

@ApiTags('用户')
@Controller('user')
@ApiBasicAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userinfoService: UserinfoService,
  ) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    let {
      userName,
      userPwd,
      userType,
      name,
      mobile,
      email,
      sex,
      birthday,
      provinceId,
      cityId,
      districtId,
      address,
      status,
    } = createUserDto;

    let user = new User();
    user.userName = userName;
    user.userPwd = userPwd;
    user.userType = userType;
    user.name = name;
    user.mobile = mobile;
    user.email = email;
    user.sex = sex;
    user.birthday = birthday;
    user.status = status;

    let userinfo = new Userinfo();
    userinfo.user = user;
    userinfo.provinceId = provinceId;
    userinfo.cityId = cityId;
    userinfo.districtId = districtId;
    userinfo.address = address;

    let userResult = await this.userService.insert(user);
    let userinfoResult = await this.userinfoService.insert(userinfo);

    return userResult;
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取列表' })
  async findList(): Promise<User[]> {
    return await this.userService.selectList();
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
  async findListPage(@Query('page') page: number, @Query('limit') limit: number): Promise<any> {
    page = page ? page : 1;
    limit = limit ? limit : 10;
    return await this.userService.selectListPage(page, limit);
  }

  @Get('findById')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<User> {
    return await this.userService.selectById(id);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@Body() updateUserDto: UpdateUserDto): Promise<any> {
    let { id } = updateUserDto;
    let entity = await this.userService.selectById(id);
    if (entity) {
      return this.userService.update(updateUserDto);
    } else {
      // todo
      return `数据 id = ${id} 不存在！`;
    }
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
    let entity = await this.userService.selectById(id);
    if (entity) {
      return await this.userService.deleteById(id);
    } else {
      // todo
      return `数据 id = ${id} 不存在！`;
    }
  }
}
