import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUserinfoDto {
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
}
