import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/swagger.const';

export class BaseRoleDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '名称', example: null })
  @IsDefined({ message: '名称不能为空！' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, {
    message: '名称不能大于 $constraint1 位！',
  })
  readonly name: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, {
    message: '描述不能大于 $constraint1 位！',
  })
  readonly description?: string;
}
