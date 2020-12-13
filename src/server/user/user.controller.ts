import { Controller, Get, Post, Req, Query, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto,  } from './dto/update.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { DeleteUserDto } from './dto/delete.user.dto';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('add')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  @ApiResponse({ status: 200, description: '请求成功！' })
  add(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.insert(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: '请求成功！' })
  login(@Body() loginUserDto: LoginUserDto): Promise<CreateUserDto> {
    return this.userService.login(loginUserDto);
  }

  @Post('register')
  @ApiResponse({ status: 200, description: '请求成功！' })
  register(@Body() registerUserDto: RegisterUserDto): Promise<CreateUserDto> {
    return this.userService.register(registerUserDto);
  }

  @Get('findList')
  findList(): Promise<User[]> {
    return this.userService.selectList();
  }

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
  findListPage(@Query('page') page: number, @Query('limit') limit: number): Promise<any> {
    page = page ? page : 1;
    limit = limit ? limit : 10;
    return this.userService.selectListPage(page, limit);
  }

  @Get('findById')
  findById(@Query('id') id: string): Promise<User> {
    return this.userService.selectById(id);
  }

  @Post('modify')
  modify(@Body() updateUserDto: UpdateUserDto): Promise<void> {
    return this.userService.update(updateUserDto);
  }

  @Post('remove')
  @ApiBody({
    type: DeleteUserDto,
    description: '主键 id',
    required: true,
  })
  remove(@Body('id') id): Promise<void> {
    return this.userService.deleteById(id);
  }
}
