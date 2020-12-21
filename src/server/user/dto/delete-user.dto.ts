import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class DeleteUserDto extends PickType(BaseUserDto, ['id']) {
}
