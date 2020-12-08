import { Controller, Get, Post, Req, Query, Body,UsePipes  } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { CreateUserDto } from './dto/create.user.dto';

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
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @ApiResponse({ status: 200, description: '请求成功！' })
  // add(@Body() user: User): Promise<User> {
  //   return this.userService.insert(user);
  // }
  add(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.insert(createUserDto);
  }

  @Get('findList')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  findList(): Promise<User[]> {
    return this.userService.selectList();
  }

  @Get('findListPage')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
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
  findListPage(@Query('page') page: number, @Query('limit') limit: number): Promise<User[]> {
    return this.userService.selectListPage(page, limit);
  }

  @Get('findById')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  findById(@Query('id') id: string): Promise<User> {
    return this.userService.selectById(id);
  }

  @Post('modify')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  modify(@Body() user: User): Promise<void> {
    return this.userService.update(user);
  }

  @Post('remove')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  remove(@Body('id') id: string): Promise<void> {
    console.log(id);
    return this.userService.deleteById(id);
  }
}
