import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { CreateCaptchaDto } from './dto/create-captcha.dto';

@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('getCaptcha')
  @ApiOperation({ summary: '验证码' })
  async getCaptcha(
    @Query() createCaptchaDto: CreateCaptchaDto,
    @Res() res,
  ): Promise<any> {
    const { captchaId } = createCaptchaDto;

    const svgCaptcha = this.captchaService.getCaptcha();

    await this.captchaService.insertCaptcha(captchaId, svgCaptcha.text);

    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
    return;
  }
}
