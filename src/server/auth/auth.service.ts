import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from './../../utils/crypto.util';
import { UserService } from '../user/user.service';
import { CaptchaService } from '../captcha/captcha.service';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly captchaService: CaptchaService,
  ) {
  }

  /**
   * 验证用户名密码
   * @param {string} userName - 用户名
   * @param {string} userPwd - 密码
   */
  async validateUser(userName: string, userPwd: string): Promise<any> {
    try {
      const user = await this.userService.selectByName(userName);

      // 注：实际中的密码处理应通过加密措施
      if (user && CryptoUtil.checkPassword(userPwd, user.userPwd)) {
        const { userPwd, ...result } = user;

        // if (user.userType === 0) {
        //   throw new ApiException('普通用户无法登录！', ApiErrorCode.FORBIDDEN, HttpStatus.OK);
        // }

        if (user.status === 0) {
          throw new ApiException('账户已冻结！', ApiErrorCode.FROZEN, HttpStatus.OK);
        }

        return result;
      } else {
        return null;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 验证图片验证码
   * @param {string} captchaId - 图片验证码 id
   * @param {string} captchaText - 图片验证码文本
   * @returns {boolean|Object}
   */
  async validateCaptcha(captchaId: string, captchaText: string): Promise<any> {
    try {
      const { captchaId: id, text } = await this.captchaService.selectCaptcha(captchaId);
      // 万能验证码 icmz
      if (captchaId.toString() === id.toString() && (captchaText.toLowerCase() === text || captchaText.toLowerCase() === 'icmz')) {
        // if (captchaId === id && (captchaText.toLowerCase() === text)) {
        return true;
      } else {
        return null;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 用户登录
   * @param {Object} user - 用户
   */
  async login(user: any) {
    try {
      const payload = {
        username: user.userName,
        userType: user.userType,
        sub: user.id,
      };
      return {
        token: this.jwtService.sign(payload),
        expiresIn: this.configService.get('jwt.expiresIn'),
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
