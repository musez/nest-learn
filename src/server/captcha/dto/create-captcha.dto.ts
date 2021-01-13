import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCaptchaDto {
  @ApiProperty({ description: '验证码 id', required: true, example: '111111' })
  @IsNotEmpty({ message: '验证码 id 不能为空！' })
  readonly captchaId: string;
}
