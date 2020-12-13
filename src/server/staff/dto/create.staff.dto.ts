import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: '主键',
    required: false,
  })
  @IsNotEmpty({ message: '主键不能为空' })
  readonly id: number;

  @ApiProperty({
    description: '名称',
    required: true,
  })
  @IsNotEmpty({ message: '用户名不能为空！' })
  readonly staffName: string;

  @ApiProperty({
    description: '密码',
    required: true,
  })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  readonly staffPwd: string;

  @ApiProperty({
    description: '姓名',
    required: false,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: '手机号',
    required: false,
  })
  readonly mobile: string;

  @ApiProperty({
    description: '性别（0：保密；1：男；2：女）',
    required: false,
  })
  readonly sex: number;

  @ApiProperty({
    description: '状态（0：禁用；1：启用）',
    required: false,
  })
  readonly status: number;

  @ApiProperty({
    description: '描述',
    required: false,
  })
  readonly description: string;
}
