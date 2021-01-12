import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BasePermissionDto {
  @ApiProperty({ description: '主键 id', required: true })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '名称', required: true, default: '' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(50, { message: '名称不能大于 50 位！' })
  readonly name: string;

  @ApiProperty({ description: '权限类别（1：导航；2：页面；3：操作；4：字段）', required: true })
  @IsNotEmpty({ message: '权限类别不能为空！' })
  readonly type: number;

  @ApiProperty({ description: '权限 CODE 代码', required: true, default: '' })
  @IsNotEmpty({ message: '权限 CODE 代码不能为空！' })
  readonly code: string;

  @ApiProperty({ description: '权限 URL 规则', required: true, default: '' })
  @IsNotEmpty({ message: '权限 URL 规则不能为空！' })
  readonly uri: string;

  @ApiProperty({ description: '父 id', required: false, default: null })
  readonly parentId: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', required: false, default: 0 })
  readonly status: number;

  @ApiProperty({ description: '描述', required: false, default: '' })
  readonly description: string;
}
