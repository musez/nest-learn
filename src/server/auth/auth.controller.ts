import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiException } from '../../common/exception/api-exception';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '登录' })
  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { type: 'string', description: '用户名', example: 'wangyue' },
        userPwd: { type: 'string', description: '密码', example: '888888' },
        captchaId: {
          type: 'string',
          description: '验证码 id',
          example: '888888',
        },
        captchaText: { type: 'string', description: '验证码', example: 'icmz' },
      },
    },
  })
  async login(@CurUser() curUser, @Body() body) {
    const { captchaId, captchaText } = body;

    const validateCaptcha = await this.authService.validateCaptcha(
      captchaId,
      captchaText,
    );
    if (validateCaptcha) {
      await this.userService.incrementLoginCount(curUser!.id); // 登录次数 +1
      return this.authService.login(curUser);
    } else {
      throw new ApiException('验证码错误！', 1007);
    }
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<CreateUserDto | void> {
    const { userName, userPwd, userPwdConfirm } = registerUserDto;

    if (userPwd !== userPwdConfirm) {
      throw new ApiException('密码不一致！', 1008);
    }

    const isExistUserName = await this.userService.isExistUserName(userName);
    if (isExistUserName) {
      throw new ApiException(`用户名：${userName} 已存在！`, 1009);
    }

    await this.userService.insert(registerUserDto);
  }

  @Get('getPermissionsByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @ApiOperation({ summary: '根据 token 获取权限（权限合集）' })
  async getPermissionsByToken(@CurUser() curUser): Promise<any> {
    const { id } = curUser;
    const isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.userService.selectAuthPermissionsByUserId(id);
  }

  @Get('getAuthByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @ApiOperation({ summary: '根据 token 获取权限（用户、用户组、角色、权限合集）' })
  async getAuthByToken(@CurUser() curUser): Promise<any> {
    const { id } = curUser;

    const isExistId = await this.userService.isExistId(id);
    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.userService.selectAuthByUserId({ id });
  }
}
