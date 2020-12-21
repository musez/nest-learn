import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class LoginUserDto extends PickType(BaseUserDto, ['userName', 'userPwd']) {
}
