import { Controller, Get, Post, Req, Query, Body } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('create')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.userService.create(createUserDto);
  }

  @Get('findAll')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  findAll(): Promise<Users[]> {
    return this.userService.findAll();
  }

  @Get('findOne')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  findOne(@Query('id') id: string): Promise<Users> {
    return this.userService.findOne(id);
  }

  // @Post('update')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  // update(@Body() createUserDto: CreateUserDto): Promise<Users> {
  //   return this.userService.update(createUserDto);
  // }

  @Post('remove')
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: 'token',
  // })
  remove(@Body('id') id: string): Promise<void> {
    console.log(id);
    return this.userService.remove(id);
  }
}
