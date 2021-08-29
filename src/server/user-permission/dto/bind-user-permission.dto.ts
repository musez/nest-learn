import {
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindUserPermissionDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '权限', example: [] })
  @IsDefined({ message: '权限不能为空！' })
  @IsNotEmpty({ message: '权限不能为空！' })
  readonly permissions: string[] | string;
}
