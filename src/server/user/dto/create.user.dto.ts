import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    description: '姓名',
    default: '',
  })
  @IsString()
  readonly name: string;

  @ApiPropertyOptional({
    description: '手机号',
    default: '',
  })
  readonly mobile: string;

  @ApiPropertyOptional({
    description: '性别（0：保密；1：男；2：女）',
    default: 0,
  })
  readonly sex: number;

  @ApiPropertyOptional({
    description: '生日',
    default: null,
  })
  readonly birthday: Date;

  @ApiPropertyOptional({
    description: '省份',
    default: null,
  })
  readonly provinceId: number;

  @ApiPropertyOptional({
    description: '城市',
    default: null,
  })
  readonly cityId: number;

  @ApiPropertyOptional({
    description: '区/县',
    default: null,
  })
  readonly districtId: number;

  @ApiPropertyOptional({
    description: '详细地址',
    default: '',
  })
  readonly address: string;

  @ApiPropertyOptional({
    description: '状态（0：禁用；1：启用）',
    default: 0,
  })
  readonly status: number;

  @ApiPropertyOptional({
    description: '描述',
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
