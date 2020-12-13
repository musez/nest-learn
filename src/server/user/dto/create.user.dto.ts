import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '名称',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '名称不能为空！' })
  readonly userName: string;

  @ApiProperty({
    description: '密码',
    required: true,
    default: '',
  })
  @IsNotEmpty({ message: '用户密码不能为空！' })
  readonly userPwd: string;

  @ApiProperty({
    description: '姓名',
    required: false,
    default: '',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: '手机号',
    required: false,
    default: '',
  })
  readonly mobile: string;

  @ApiProperty({
    description: '性别（0：保密；1：男；2：女）',
    required: false,
    default: 0,
  })
  readonly sex: number;

  @ApiProperty({
    description: '生日',
    required: false,
    default: null,
  })
  readonly birthday: Date;

  @ApiProperty({
    description: '省份',
    required: false,
    default: null,
  })
  readonly provinceId: number;

  @ApiProperty({
    description: '城市',
    required: false,
    default: null,
  })
  readonly cityId: number;

  @ApiProperty({
    description: '区/县',
    required: false,
    default: null,
  })
  readonly districtId: number;

  @ApiProperty({
    description: '详细地址',
    required: false,
    default: '',
  })
  readonly address: string;

  @ApiProperty({
    description: '状态（0：禁用；1：启用）',
    required: false,
    default: 0,
  })
  readonly status: number;

  @ApiProperty({
    description: '描述',
    required: false,
    default: '',
  })
  readonly description: string;

  // @ApiProperty({
  //   description: '创建时间',
  //   required: false,
  // })
  // readonly createTime: Date;
  //
  // @ApiProperty({
  //   description: '修改时间',
  //   required: false,
  // })
  // readonly updateTime: Date;
  //
  // @ApiProperty({
  //   description: '最后登录时间',
  //   required: false,
  // })
  // readonly loginTime: Date;
  //
  // @ApiProperty({
  //   description: '登录次数',
  //   required: false,
  // })
  // readonly loginCount: number;
}
