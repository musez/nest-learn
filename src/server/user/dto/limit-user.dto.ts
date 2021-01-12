import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitUserDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '用户名' })
  readonly userName: string;

  @ApiPropertyOptional({ description: '手机号' })
  readonly mobile: string;
}
