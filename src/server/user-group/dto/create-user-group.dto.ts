import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateUserGroupDto {
  @ApiProperty({ description: '用户 id'})
  @IsNotEmpty({ message: '用户 id 不能为空' })
  userId: string;

  @ApiProperty({ description: '用户组 id'})
  @IsNotEmpty({ message: '用户组 id 不能为空' })
  groupId: string;
}
