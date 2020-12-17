import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { CreateUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '主键 id',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  @IsUUID('all')
  readonly id: string;
}
