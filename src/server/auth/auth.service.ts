import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CaptchaService } from '../captcha/captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly captchaService: CaptchaService,
  ) {
  }

  /**
   * validate username and password
   * @param username
   * @param password
   */
  async validateUser(userName: string, userPwd: string): Promise<any> {
    const user = await this.userService.selectByName(userName);
    // 注：实际中的密码处理应通过加密措施
    let userPwdCrypto = crypto.createHmac('sha256', userPwd).digest('hex');
    if (user && user.userPwd === userPwdCrypto) {
      const { userPwd, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async validateCaptcha(captchaId: string, captchaText: string): Promise<any> {
    let captcha = await this.captchaService.selectCaptcha();

    if (captcha.captchaId === captchaId && captcha.text === captchaText.toLowerCase()) {
      return true;
    } else {
      return null;
    }
  }

  /**
   * user login
   * @param user
   */
  async login(user: any) {
    const payload = { username: user.userName, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
