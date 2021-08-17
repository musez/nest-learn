import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/constants';

export class BasePermissionDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '父 id', example: null })
  readonly parentId?: string;

  @ApiProperty({ description: '名称', example: null })
  @IsDefined({ message: '名称不能为空！' })
  @IsNotEmpty({ message: '名称不能为空！' })
  @MaxLength(BaseConstants.NAME_MAX_LENGTH, {
    message: '名称不能大于 $constraint1 位！',
  })
  readonly name: string;

  @ApiProperty({
    description: '权限类别（1：目录；2：菜单；3：操作；4：字段；5：数据）',
  })
  @IsDefined({ message: '权限类别不能为空！' })
  @IsNotEmpty({ message: '权限类别不能为空！' })
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '权限类别必须为数字！' })
  readonly type: number;

  @ApiPropertyOptional({ description: '权限 CODE 代码', example: null })
  @IsOptional()
  @IsNotEmpty({ message: '权限 CODE 代码不能为空！' })
  readonly code?: string;

  @ApiPropertyOptional({ description: '权限路由 SORT', example: 0 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '权限路由 SORT 必须为数字！' })
  readonly sort?: number;

  @ApiPropertyOptional({ description: '权限路由 COMPONENT', example: null })
  readonly routerComponent?: string;

  @ApiPropertyOptional({
    description: '权限路由 HIDDEN（0：不隐藏；1：隐藏；）',
    example: 0,
  })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '权限路由 HIDDEN 必须为数字！' })
  readonly routerHidden?: number;

  @ApiPropertyOptional({ description: '权限路由 ICON', example: null })
  readonly routerIcon: string;

  @ApiPropertyOptional({ description: '权限路由 PATH', example: null })
  readonly routerPath?: string;

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
