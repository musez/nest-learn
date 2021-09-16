import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiException } from '../../common/exception/api-exception';
import * as svgCaptcha from 'svg-captcha';
import { CacheService } from '../cache/cache.service';
import { CaptchaPrefix } from '../../constants/captcha.prefix';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

/**
 * 使用方式一、控制器中发送验证码
 *  1.获取验证码
 *  let svgCaptcha = xx.getCaptcha();
 *  2.设置 session（或者 redis 存储中）
 *  req.session.code = svgCaptcha.text;
 *  3.设置响应类型
 *  res.type('image/svg+xml');
 *  4.发送
 *  res.send(svgCaptcha.data);
 */
@Injectable()
export class CaptchaService {
  constructor(private readonly cacheService: CacheService) {
  }

  /**
   * 生成验证码
   */
  getCaptcha(): { data: any; text: string } {
    try {
      const captcha: { data: any; text: string } = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
      });

      return captcha;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 缓存到 redis
   */
  async insertCaptcha(captchaId, captchaText): Promise<any> {
    try {
      const key = `${CaptchaPrefix.CAPTCHA}${captchaId}`;
      return await this.cacheService.set(
        key,
        {
          captchaId,
          text: captchaText.toLowerCase(),
        },
        2 * 60,
      );
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 从 redis 获取
   */
  async selectCaptcha(captchaId): Promise<any> {
    try {
      const key = `${CaptchaPrefix.CAPTCHA}${captchaId}`;
      const captcha = await this.cacheService.get(key);
      if (!captcha) {
        throw new ApiException('验证码错误！', ApiErrorCode.INVALID_CAPTCHA, HttpStatus.OK);
      }
      await this.cacheService.del(key);

      return captcha;
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
