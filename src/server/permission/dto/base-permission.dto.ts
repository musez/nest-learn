import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BasePermissionDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '名称', example: '' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(50, { message: '名称不能大于 50 位！' })
  readonly name: string;

  @ApiProperty({ description: '权限类别（1：导航；2：页面；3：操作；4：字段）' })
  @IsNotEmpty({ message: '权限类别不能为空！' })
  @Transform(type => Number.parseInt(type))
  @IsInt({ message: '权限类别必须为数字！' })
  readonly type: number;

  @ApiProperty({ description: '权限 CODE 代码', example: '' })
  @IsNotEmpty({ message: '权限 CODE 代码不能为空！' })
  readonly code: string;

  @ApiProperty({ description: '权限 URI 规则', example: '' })
  @IsNotEmpty({ message: '权限 URI 规则不能为空！' })
  readonly uri: string;

  @ApiPropertyOptional({ description: '权限路由 PATH', example: '' })
  readonly routerPath: string;

  @ApiPropertyOptional({ description: '权限路由 NAME', example: '' })
  readonly routerName: string;

  @ApiPropertyOptional({ description: '权限路由 REDIRECT', example: '' })
  readonly routerRedirect: string;

  @ApiPropertyOptional({ description: '权限路由 COMPONENT', example: '' })
  readonly routerComponent: string;

  @ApiPropertyOptional({ description: '权限路由 HIDDEN（0：不隐藏；1：隐藏；）', example: 0 })
  @Transform(routerHidden => Number.parseInt(routerHidden))
  @IsInt({ message: '权限路由 HIDDEN 必须为数字！' })
  readonly routerHidden: number;

  @ApiPropertyOptional({ description: '权限路由 TITLE', example: '' })
  readonly routerTitle: string;

  @ApiPropertyOptional({ description: '权限路由 ICON', example: '' })
  readonly routerIcon: string;

  @ApiPropertyOptional({ description: '权限路由 SORT', example: 0 })
  @Transform(routerSort => Number.parseInt(routerSort))
  @IsInt({ message: '权限路由 SORT 必须为数字！' })
  readonly routerSort: number;

  @ApiPropertyOptional({ description: '父 id', example: null })
  readonly parentId: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @Transform(status => Number.parseInt(status))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: '' })
  readonly description: string;
}
