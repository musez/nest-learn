import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  IsUUID,
  IsMobilePhone,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BaseConstants,
  UserConstants,
} from '../../../constants/swagger.const';

export class BaseUserAddressDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  // @ApiProperty({ description: '用户 id', example: null })
  // @IsDefined({ message: '用户 id 不能为空！' })
  // @IsNotEmpty({ message: '用户 id 不能为空！' })
  // @IsUUID('all')
  // readonly userId: string;

  @ApiPropertyOptional({ description: '姓名', example: '王' })
  @IsOptional()
  @IsString()
  @MinLength(UserConstants.NAME_MIN_LENGTH, {
    message: '姓名不能小于 $constraint1 位！',
  })
  @MaxLength(UserConstants.NAME_MAX_LENGTH, {
    message: '姓名不能大于 $constraint1 位！',
  })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号', example: '15171111111' })
  @IsOptional()
  @IsMobilePhone('zh-CN')
  readonly mobile?: string;

  @ApiPropertyOptional({
    description: '性别（0：保密；1：男；2：女）',
    example: 0,
  })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '性别必须为数字！' })
  readonly sex?: number;

  @ApiPropertyOptional({ description: '省份', example: null })
  readonly provinceId?: number;

  @ApiPropertyOptional({ description: '城市', example: null })
  readonly cityId?: number;

  @ApiPropertyOptional({ description: '区/县', example: null })
  readonly districtId?: number;

  @ApiPropertyOptional({ description: '详细地址', example: null })
  @IsOptional()
  @MaxLength(UserConstants.ADDRESS_MAX_LENGTH, {
    message: '详细地址不能大于 $constraint1 位！',
  })
  readonly address?: string;

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
