import { IsDefined, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../user/dto/base-user.dto';
import { UserConstants } from '../../../constants/swagger.const';

export class RegisterUserDto extends PickType(BaseUserDto, [
  'userName',
  'userPwd',
]) {
  @ApiProperty({ description: '确认密码', example: '888888' })
  @IsDefined({ message: '确认密码不能为空！' })
  @IsNotEmpty({ message: '确认密码不能为空！' })
  @MinLength(UserConstants.PASSWORD_MIN_LENGTH, {
    message: '确认密码不能小于 $constraint1 位！',
  })
  @MaxLength(UserConstants.PASSWORD_MAX_LENGTH, {
    message: '确认密码不能大于 $constraint1 位！',
  })
  readonly userPwdConfirm: string;
}
