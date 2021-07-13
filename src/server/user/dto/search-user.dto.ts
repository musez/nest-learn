import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitUserDto } from './limit-user.dto';

export class SearchUserDto extends PickType(LimitUserDto, ['side', 'userName', 'name', 'userType', 'mobile', 'email']) {
}
