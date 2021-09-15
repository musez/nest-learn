import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../user/dto/base-user.dto';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class LoginUserDto extends PickType(BaseUserDto, [
  'userName',
  'userPwd',
]) {
  @ApiProperty({ description: '验证码 id', example: '888888' })
  @IsDefined({ message: '验证码 id 不能为空！' })
  @IsNotEmpty({ message: '验证码 id 不能为空！' })
  readonly captchaId: string;

  @ApiProperty({ description: '验证码', example: 'icmz' })
  @IsDefined({ message: '验证码不能为空！' })
  @IsNotEmpty({ message: '验证码不能为空！' })
  readonly captchaText: string;
}
