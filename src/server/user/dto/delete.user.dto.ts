import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { BaseUserDto } from './base.user.dto';

export class DeleteUserDto extends PickType(BaseUserDto, ['id']) {
  // @ApiProperty({
  //   required: true,
  //   default: '',
  // })
  // @IsNotEmpty({ message: '主键 id 不能为空' })
  // readonly id: string;
}
