import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiQuery,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';

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
        userName: { type: 'string', description: '用户名', example: 'wangyue' },
        userPwd: { type: 'string', description: '密码', example: '888888' },
        captchaId: { type: 'string', description: '验证码 id', example: '888888' },
        captchaText: { type: 'string', description: '验证码', example: 'icmz' },
      },
    },
  })
  async login(@CurUser() curUser, @Body() body) {
    let { captchaId, captchaText } = body;

    const validateCaptcha = await this.authService.validateCaptcha(captchaId, captchaText);
    if (validateCaptcha) {
      await this.userService.incrementLoginCount(curUser.id);// 登录次数 +1
      return this.authService.login(curUser);
    } else {
      throw new UnauthorizedException('验证码错误！');
    }
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<CreateUserDto> {
    let { userPwd, userPwdConfirm } = registerUserDto;

    if (userPwd !== userPwdConfirm) {
      throw new BadRequestException('密码不一致！');
    }

    return await this.userService.insert(registerUserDto);
  }

  @Get('getPermissionsByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: '根据 token 获取权限' })
  async getPermissionsByToken(@CurUser() curUser): Promise<any> {
    let { id } = curUser;
    return await this.userService.selectPermissionsByUserId(id);
  }
}
