import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArticleCatConstants,
  BaseConstants,
} from '../../../constants/constants';

export class BaseArticleCatDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '父 id', example: null })
  readonly parentId?: string;

  @ApiProperty({ description: '栏目名称', example: null })
  @IsDefined({ message: '栏目名称不能为空！' })
  @IsNotEmpty({ message: '栏目名称不能为空！' })
  @MaxLength(ArticleCatConstants.CAT_NAME_MAX_LENGTH, {
    message: '栏目名称不能大于 $constraint1 位！',
  })
  readonly catName: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, {
    message: '描述不能大于 $constraint1 位！',
  })
  readonly description?: string;
}
