import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {
  }

  @Get('getCaptcha')
  @ApiOperation({ summary: '验证码' })
  async getCaptcha(@Query() createCaptchaDto: CreateCaptchaDto, @Res() res): Promise<any> {
    try {
      const { captchaId } = createCaptchaDto;

      const svgCaptcha = this.captchaService.getCaptcha();

      await this.captchaService.insertCaptcha(captchaId, svgCaptcha.text);

      res.type('image/svg+xml');
      res.send(svgCaptcha.data);
      return;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
