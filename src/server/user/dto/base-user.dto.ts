import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '名称', required: true, example: 'wang' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(50, { message: '名称不能大于 50 位！' })
  readonly userName: string;

  @ApiProperty({ description: '密码', example: '888888' })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  @MinLength(6, { message: '用户密码不能小于 6 位！' })
  @MaxLength(18, { message: '用户密码不能大于 18 位！' })
  readonly userPwd: string;

  @ApiProperty({ description: '用户类型（0：普通用户；1：管理员；2：超级管理员；）', example: 0 })
  @Transform(userType => Number.parseInt(userType))
  @IsInt({ message: '用户类型必须为数字！' })
  readonly userType?: number;

  @ApiPropertyOptional({ description: '姓名', example: '王' })
  @IsString()
  @MaxLength(50, { message: '姓名不能大于 50 位！' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号', example: '15171111111' })
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '邮箱', example: '123@qq.com' })
  // @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: '性别（0：保密；1：男；2：女）', example: 0 })
  @Transform(sex => Number.parseInt(sex))
  @IsInt({ message: '性别必须为数字！' })
  readonly sex?: number;

  @ApiPropertyOptional({ description: '生日', example: '2020-12-25' })
  readonly birthday?: Date;

  @ApiPropertyOptional({ description: '省份', example: null })
  readonly provinceId?: string;

  @ApiPropertyOptional({ description: '城市', example: null })
  readonly cityId?: string;

  @ApiPropertyOptional({ description: '区/县', example: null })
  readonly districtId?: string;

  @ApiPropertyOptional({ description: '详细地址', example: null })
  readonly address?: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: '' })
  readonly description?: string;

  @ApiPropertyOptional({ description: '最后登录时间' })
  readonly loginTime: Date;

  @ApiPropertyOptional({ description: '登录次数' })
  readonly loginCount: number;
}
