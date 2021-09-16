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
import { DictItemConstants } from '../../../constants/swagger.const';

export class BaseDictItemDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '父 id' })
  @IsDefined({ message: '父 id 不能为空！' })
  @IsNotEmpty({ message: '父 id 不能为空！' })
  @IsUUID('all')
  readonly parentId: string;

  @ApiProperty({ description: '字典项名称', example: '字典项名称1' })
  @IsDefined({ message: '字典项名称不能为空！' })
  @IsNotEmpty({ message: '字典项名称不能为空！' })
  @MaxLength(DictItemConstants.ITEM_TEXT_MAX_LENGTH, {
    message: '字典项名称不能大于 $constraint1 位！',
  })
  readonly itemText: string;

  @ApiProperty({ description: '字典项值', example: '字典项值1' })
  @IsDefined({ message: '字典项值不能为空！' })
  @IsNotEmpty({ message: '字典项值不能为空！' })
  @MaxLength(DictItemConstants.ITEM_VALUE_MAX_LENGTH, {
    message: '字典项值不能大于 $constraint1 位！',
  })
  readonly itemValue: string;

  @ApiPropertyOptional({ description: '默认值（0：否；1：是）', example: null })
  readonly defaultValue?: number;

  @ApiPropertyOptional({ description: '排序', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '排序必须为数字！' })
  readonly sort?: number;
}
