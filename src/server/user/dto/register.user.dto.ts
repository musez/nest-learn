import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base.user.dto';

export class RegisterUserDto extends PickType(BaseUserDto, ['userName', 'userPwd', 'mobile']) {
}
