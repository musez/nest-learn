import {
  IsDefined,
  ValidateIf,
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants, UserConstants } from '../../../constants/constants';

export class BaseUserDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '名称', required: true, example: 'wang' })
  @IsDefined({ message: '名称不能为空！' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MinLength(UserConstants.USERNAME_MIN_LENGTH, { message: '名称不能小于 $constraint1 位！' })
  @MaxLength(UserConstants.USERNAME_MAX_LENGTH, { message: '名称不能大于 $constraint1 位！' })
  readonly userName: string;

  @ApiProperty({ description: '密码', example: '888888' })
  @IsDefined({ message: '用户密码不能为空！' })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  @MinLength(UserConstants.PASSWORD_MIN_LENGTH, { message: '用户密码不能小于 $constraint1 位！' })
  @MaxLength(UserConstants.PASSWORD_MAX_LENGTH, { message: '用户密码不能大于 $constraint1 位！' })
  readonly userPwd: string;

  @ApiProperty({ description: '用户类型（0：普通用户；1：管理员；2：超级管理员；）', example: 0 })
  @IsDefined({ message: '用户类型不能为空！' })
  @IsNotEmpty({ message: '用户类型不能为空！' })
  @Transform(userType => Number.parseInt(userType))
  @IsInt({ message: '用户类型必须为数字！' })
  readonly userType?: number;

  @ApiPropertyOptional({ description: '姓名', example: '王' })
  @IsOptional()
  @IsString()
  @MinLength(UserConstants.NAME_MIN_LENGTH, { message: '姓名不能小于 $constraint1 位！' })
  @MaxLength(UserConstants.NAME_MAX_LENGTH, { message: '姓名不能大于 $constraint1 位！' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号', example: '15171111111' })
  @IsOptional()
  @IsMobilePhone('zh-CN')
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '邮箱', example: '123@qq.com' })
  // @ValidateIf(obj => {
  //   return obj && typeof obj.email !== 'undefined';
  // })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: '性别（0：保密；1：男；2：女）', example: 0 })
  @IsOptional()
  @Transform(sex => Number.parseInt(sex))
  @IsInt({ message: '性别必须为数字！' })
  readonly sex?: number;

  @ApiPropertyOptional({ description: '生日', example: '2020-12-25' })
  readonly birthday?: Date;

  @ApiPropertyOptional({ description: '省份', example: null })
  readonly provinceId?: number;

  @ApiPropertyOptional({ description: '城市', example: null })
  readonly cityId?: number;

  @ApiPropertyOptional({ description: '区/县', example: null })
  readonly districtId?: number;

  @ApiPropertyOptional({ description: '详细地址', example: null })
  @IsOptional()
  @MaxLength(UserConstants.ADDRESS_MAX_LENGTH, { message: '详细地址不能大于 $constraint1 位！' })
  readonly address?: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, { message: '描述不能大于 $constraint1 位！' })
  readonly description?: string;
}
