import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { CacheService } from '../cache/cache.service';

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
  getCaptcha(): { data: any, text: string } {
    const captcha: { data: any, text: string } = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
    });

    return captcha;
  }

  /**
   * 缓存到 redis
   */
  async insertCaptcha(captchaId, captchaText): Promise<any> {
    return await this.cacheService.set('captcha', {
      captchaId,
      text: captchaText.toLowerCase(),
    }, 2 * 60);
  }

  /**
   * 从 redis 获取
   */
  async selectCaptcha(): Promise<any> {
    return await this.cacheService.get('captcha');
  }
}
