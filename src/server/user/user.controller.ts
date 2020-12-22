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
import { AuthGuard } from '@nestjs/passport';
import CryptoJS from 'crypto-js';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { UserinfoService } from '../userinfo/userinfo.service';
import { Area } from '../area/entities/area.entity';

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
      province,
      city,
      district,
      address,
    } = createUserDto;

    let user = new User();

    for (let key in createUserDto) {
      if (createUserDto[key] !== null && createUserDto[key] !== 0) {
        user[key] = createUserDto[key];
      }
    }

    let userinfo = new Userinfo();
    if (province !== null) {
      userinfo.province = province;
    }

    if (city !== null) {
      userinfo.city = city;
    }

    if (district !== null) {
      userinfo.district = district;
    }

    if (address !== null) {
      userinfo.address = address;
    }

    user.userinfo = userinfo;

    let userResult = await this.userService.insert(user);
    // userinfo.user = user;
    // let userinfoResult = await this.userinfoService.insert(userinfo);

    return userResult;
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
    name: 'userName',
    description: '用户名',
    required: false,
  })
  @ApiQuery({
    name: 'mobile',
    description: '手机号',
    required: false,
  })
  async findListPage(@Query() query): Promise<any> {
    return await this.userService.selectListPage(query);
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
    let {
      id,
      province,
      city,
      district,
      address,
    } = updateUserDto;
    let userSelectById = await this.userService.selectById(id);
    if (!userSelectById) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let user = new User();

    for (let cityKey in updateUserDto) {
      if (updateUserDto[cityKey] !== null && updateUserDto[cityKey] !== 0) {
        user[cityKey] = updateUserDto[cityKey];
      }
    }

    let userinfo = new Userinfo();
    if (province !== null) {
      userinfo.province = province;
    }

    if (city !== null) {
      userinfo.city = city;
    }

    if (district !== null) {
      userinfo.district = district;
    }

    if (address !== null) {
      userinfo.address = address;
    }

    user.userinfo = userinfo;

    return this.userService.update(user);
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
    // let entity = await this.userService.selectById(id);
    // if (!entity) {
    //   throw new BadRequestException(`数据 id = ${id} 不存在！`);
    // }

    return await this.userService.deleteById(id);
  }
}
