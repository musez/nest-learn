import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { Transform } from 'class-transformer';

export class LimitUserAddressDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '姓名' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号' })
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;
}
