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
import { BaseConstants, OrgConstants } from '../../../constants/swagger.const';

export class BaseOrgDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '父 id', example: null })
  readonly parentId?: string;

  @ApiProperty({ description: '机构名称', example: null })
  @IsDefined({ message: '机构名称不能为空！' })
  @IsNotEmpty({ message: '机构名称不能为空！' })
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, {
    message: '机构名称不能大于 $constraint1 位！',
  })
  readonly name: string;

  @ApiPropertyOptional({ description: '机构简称', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, {
    message: '机构简称不能大于 $constraint1 位！',
  })
  readonly shortName?: string;

  @ApiPropertyOptional({ description: '机构类型', example: 0 })
  @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  @Type(() => Number)
  @IsInt({ message: '机构类型必须为数字！' })
  readonly orgType?: number;

  @ApiPropertyOptional({ description: '机构级次码', example: null })
  @IsOptional()
  @MaxLength(OrgConstants.ORG_LEVEL_MAX_LENGTH, {
    message: '机构级次码不能大于 $constraint1 位！',
  })
  readonly orgLevel?: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 1 })
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
