import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseUserGroupDto } from './base-user-group.dto';

export class CreateUserGroupDto extends PickType(BaseUserGroupDto,
  ['name', 'status', 'description']
) {

}
