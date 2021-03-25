import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
