import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { UpdateCaptchaDto } from './dto/update-captcha.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CaptchaService {
  constructor(private readonly cacheService: CacheService) {
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-07 16:56:15
   * @LastEditors: 水痕
   * @Description: 生产图形验证码的方法
   * @param {type}
   * @return:
   */
  getCaptcha(captchaId): { data: any, text: string } {
    const captcha: { data: any, text: string } = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
    });

    return captcha;
  }

  async insertCaptcha(captchaId, captchaText): Promise<any> {
    return await this.cacheService.set('captcha', {
      captchaId,
      text: captchaText.toLowerCase(),
    });
  }

  async selectCaptcha(): Promise<any> {
    return await this.cacheService.get('captcha');
  }

  /**
   * 使用方式一、控制器中发送验证码
   *  1.获取验证码
   *  let svgCaptcha = xx.getCaptcha();
   *  2.设置 session(或者 redis 存储中)
   *  req.session.code = svgCaptcha.text;
   *  3.设置响应类型
   *  res.type('image/svg+xml');
   *  4.发送
   *  res.send(svgCaptcha.data);
   */
}
