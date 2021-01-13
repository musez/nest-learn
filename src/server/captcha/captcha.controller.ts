import { Controller, Get, Post, Query, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { UpdateCaptchaDto } from './dto/update-captcha.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CacheService } from '../cache/cache.service';

@Controller('captcha')
export class CaptchaController {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly cacheService: CacheService,
  ) {
  }

  @Get('getCaptcha')
  @ApiOperation({ summary: '验证码' })
  async getCaptcha(@Query('captchaId') captchaId: string, @Res() res): Promise<any> {
    let svgCaptcha = this.captchaService.getCaptcha(captchaId);

    await this.captchaService.insertCaptcha(captchaId, svgCaptcha.text);

    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
    return;
  }
}
