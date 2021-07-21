import { IsDefined, IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/constants';

export class BasePostDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '岗位名称', example: null })
  @IsDefined({ message: '岗位名称不能为空！' })
  @IsNotEmpty({ message: '岗位名称不能为空' })
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, { message: '岗位名称不能大于 $constraint1 位！' })
  readonly name: string;

  @ApiPropertyOptional({ description: '排序', example: 0 })
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt({ message: '排序必须为数字！' })
  readonly sort?: number;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, { message: '描述不能大于 $constraint1 位！' })
  readonly description?: string;
}
