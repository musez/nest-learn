import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { Users } from './user.entity';

@ApiTags('用户,安全')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('list')
  findAll(): Promise<Users[]> {
    return this.userService.findAll();
  }
}
