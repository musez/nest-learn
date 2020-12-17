import { Controller, Get, Post, Req, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { DeleteUserDto } from './dto/delete.user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<CreateUserDto> {
    return await this.userService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.userService.insert(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findList')
  async findList(): Promise<User[]> {
    return await this.userService.selectList();
  }

  @UseGuards(JwtAuthGuard)
  @Get('findListPage')
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

  @UseGuards(JwtAuthGuard)
  @Get('findById')
  async findById(@Query('id') id: string): Promise<User> {
    return await this.userService.selectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('modify')
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

  @UseGuards(JwtAuthGuard)
  @Post('remove')
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
