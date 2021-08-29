import {
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindUserGroupDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '用户组', example: [] })
  @IsDefined({ message: '用户组不能为空！' })
  @IsNotEmpty({ message: '用户组不能为空！' })
  readonly groups: string[] | string;
}
