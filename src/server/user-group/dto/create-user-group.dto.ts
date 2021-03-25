import { IsDefined, IsNotEmpty, IsString, IsInt, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateUserGroupDto {
  @ApiProperty({ description: '用户 id' })
  @IsDefined({ message: '用户 id 不能为空！' })
  @IsNotEmpty({ message: '用户 id 不能为空！' })
  @IsUUID('all')
  userId: string;

  @ApiProperty({ description: '用户组 id' })
  @IsDefined({ message: '用户组 id 不能为空！' })
  @IsNotEmpty({ message: '用户组 id 不能为空！' })
  @IsUUID('all')
  groupId: string;
}
