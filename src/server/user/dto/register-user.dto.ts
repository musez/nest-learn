import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class RegisterUserDto extends PickType(BaseUserDto, ['userName', 'userPwd', 'mobile']) {
  @ApiProperty({ description: '确认密码', required: true, example: '111111' })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  readonly userPwdConfirm: string;
}
