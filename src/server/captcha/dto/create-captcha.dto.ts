import { IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaptchaDto {
  @ApiProperty({ description: '验证码 id', example: '123456' })
  @IsDefined({ message: '验证码 id 不能为空！' })
  @IsNotEmpty({ message: '验证码 id 不能为空！' })
  readonly captchaId: string;
}
