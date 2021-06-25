import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from './../../utils/crypto.util';
import { UserService } from '../user/user.service';
import { CaptchaService } from '../captcha/captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly captchaService: CaptchaService,
    private readonly cryptoUtil: CryptoUtil,
  ) {
  }

  /**
   * 验证用户名密码
   * @param {string} userName - 用户名
   * @param {string} userPwd - 密码
   */
  async validateUser(userName: string, userPwd: string): Promise<any> {
    const user = await this.userService.selectByName(userName);
    // 注：实际中的密码处理应通过加密措施
    if (user && this.cryptoUtil.checkPassword(userPwd, user.userPwd)) {
      const { userPwd, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  /**
   * 验证图片验证码
   * @param {string} captchaId - 图片验证码 id
   * @param {string} captchaText - 图片验证码文本
   * @returns {boolean|Object}
   */
  async validateCaptcha(captchaId: string, captchaText: string): Promise<any> {
    const captcha = await this.captchaService.selectCaptcha();

    // 万能验证码 icmz
    if ((captchaId.toString() === captcha.captchaId.toString()) && (captchaText.toLowerCase() === captcha.text || captchaText.toLowerCase() === 'icmz')) {
      // if (captchaId === captcha.captchaId && (captchaText.toLowerCase() === captcha.text)) {
      return true;
    } else {
      return null;
    }
  }

  /**
   * 用户登录
   * @param {Object} user - 用户
   */
  async login(user: any) {
    const payload = { username: user.userName, userType: user.userType, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
