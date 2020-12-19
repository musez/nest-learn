import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiHeaders,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../user/dto/register.user.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserService } from '../user/user.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '登录' })
  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          description: '用户名',
          default: 'wangyue',
        },
        userPwd: {
          type: 'string',
          description: '密码',
          default: '111111',
        },
      },
    },
  })
  async login(@Request() request) {
    let user = request.user;
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<CreateUserDto> {
    return await this.userService.register(registerUserDto);
  }
}
