import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  PickType,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindUserGroupDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '用户组', example: [] })
  @IsDefined({ message: '用户组不能为空！' })
  @IsNotEmpty({ message: '用户组不能为空！' })
  readonly groups: string[];
}
