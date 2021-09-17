import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { Transform } from 'class-transformer';

export class LimitUserDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '用户名' })
  readonly userName?: string;

  @ApiPropertyOptional({ description: '姓名' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '用户类型' })
  readonly userType?: number;

  @ApiPropertyOptional({ description: '手机号' })
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  readonly email?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）' })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
  readonly status?: string;
}
