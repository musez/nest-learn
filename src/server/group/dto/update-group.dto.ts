import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({
    description: '主键 id',
    required: true,
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
