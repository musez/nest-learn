import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({
    description: '主键 id',
    required: true,
  })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({
    description: '名称',
    required: true,
  })
  @IsNotEmpty({ message: '名称不能为空！' })
  readonly userName: string;

  @ApiProperty({
    description: '密码',
    required: true,
  })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  @MinLength(6, {
    message: '用户密码不能小于 6 位！',
  })
  @MaxLength(18, {
    message: '用户密码不能大于 18 位！',
  })
  readonly userPwd: string;

  @IsInt({ message: '用户类型必须为数字！' })
  @ApiPropertyOptional({
    description: '用户类型（0：普通用户；1：管理员；）',
    default: 0,
  })
  readonly userType?: number;

  @ApiPropertyOptional({
    description: '姓名',
  })
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: '手机号',
  })
  readonly mobile?: string;

  @ApiPropertyOptional({
    description: '邮箱',
  })
  @IsEmail()
  readonly email?: string;

  @IsInt({ message: '性别必须为数字！' })
  @ApiPropertyOptional({
    description: '性别（0：保密；1：男；2：女）',
    default: 0,
  })
  readonly sex?: number;

  @ApiPropertyOptional({
    description: '生日',
  })
  readonly birthday?: Date;

  @ApiPropertyOptional({
    description: '省份',
  })
  readonly provinceId?: number;

  @ApiPropertyOptional({
    description: '城市',
  })
  readonly cityId?: number;

  @ApiPropertyOptional({
    description: '区/县',
  })
  readonly districtId?: number;

  @ApiPropertyOptional({
    description: '详细地址',
  })
  readonly address?: string;

  @IsInt({ message: '状态必须为数字！' })
  @ApiPropertyOptional({
    description: '状态（0：禁用；1：启用）',
    default: 0,
  })
  readonly status?: number;

  @ApiPropertyOptional({
    description: '描述',
  })
  readonly description?: string;

  @ApiProperty({
    description: '创建时间',
    required: false,
  })
  readonly createTime: Date;

  @ApiProperty({
    description: '修改时间',
    required: false,
  })
  readonly updateTime: Date;

  @ApiProperty({
    description: '最后登录时间',
    required: false,
  })
  readonly loginTime: Date;

  @ApiProperty({
    description: '登录次数',
    required: false,
  })
  readonly loginCount: number;
}