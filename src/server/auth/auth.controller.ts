import { Body, Controller, Get, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: ApiErrorCode.LOGIN_ERROR, description: '用户名或密码错误！' })
  @ApiResponse({ status: ApiErrorCode.INVALID_CAPTCHA, description: '验证码错误！' })
  @ApiResponse({ status: ApiErrorCode.FROZEN, description: '账户已冻结！' })
  @ApiOperation({ summary: '登录' })
  async login(@CurUser() curUser, @Body() loginUserDto: LoginUserDto) {
    try {
      const { captchaId, captchaText } = loginUserDto;

      const validateCaptcha = await this.authService.validateCaptcha(
        captchaId,
        captchaText,
      );
      if (validateCaptcha) {
        await this.userService.incrementLoginCount(curUser!.id); // 登录次数 +1
        return this.authService.login(curUser);
      } else {
        throw new ApiException('验证码错误！', ApiErrorCode.INVALID_CAPTCHA, HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('register')
  @ApiResponse({ status: ApiErrorCode.INVALID_PASSWORD, description: '密码不一致！' })
  @ApiResponse({ status: ApiErrorCode.USER_NAME_EXISTS, description: '用户名已存在！' })
  @ApiOperation({ summary: '注册' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<CreateUserDto | void> {
    try {
      const { userName, userPwd, userPwdConfirm } = registerUserDto;

      if (userPwd !== userPwdConfirm) {
        throw new ApiException('密码不一致！', ApiErrorCode.INVALID_PASSWORD, HttpStatus.OK);
      }

      const isExistUserName = await this.userService.isExistUserName(userName);
      if (isExistUserName) {
        throw new ApiException(`用户名：${userName} 已存在！`, ApiErrorCode.USER_NAME_EXISTS, HttpStatus.OK);
      }

      await this.userService.insert(registerUserDto);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getPermissionsByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @ApiOperation({ summary: '根据 token 获取权限（权限合集）' })
  async getPermissionsByToken(@CurUser() curUser): Promise<any> {
    try {
      const { id } = curUser;
      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.userService.selectAuthPById(id);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('getAuthByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @ApiOperation({ summary: '根据 token 获取权限（用户、用户组、角色、权限合集）' })
  async getAuthByToken(@CurUser() curUser): Promise<any> {
    try {
      const { id } = curUser;

      const isExistId = await this.userService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.userService.selectAuthUGRPById({ id });
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('/loginOut')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @ApiOperation({ summary: '登出（注销登录）' })
  async loginOut(@CurUser() curUser) {
    try {
      return this.userService.loginOut(curUser);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
