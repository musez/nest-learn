import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { CreateStaffDto } from './create.staff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @ApiProperty({
    description: '主键 id',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
