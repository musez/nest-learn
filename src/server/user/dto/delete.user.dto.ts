import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
