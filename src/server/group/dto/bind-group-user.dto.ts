import {
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindGroupUserDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '用户', example: [] })
  @IsDefined({ message: '用户不能为空！' })
  @IsNotEmpty({ message: '用户不能为空！' })
  readonly users: string[] | string;
}
