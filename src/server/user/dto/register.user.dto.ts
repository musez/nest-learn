import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: '名称',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '名称不能为空！' })
  readonly userName: string;

  @ApiProperty({
    description: '密码',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  readonly userPwd: string;

  @ApiPropertyOptional({
    description: '手机号',
    required: true,
    default: '',
  })
  readonly mobile: string;
}
