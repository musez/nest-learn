import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUserinfoDto {
  @ApiPropertyOptional({ description: '省份', })
  readonly province?: string;

  @ApiPropertyOptional({ description: '城市', })
  readonly city?: string;

  @ApiPropertyOptional({ description: '区/县', })
  readonly district?: string;

  @ApiPropertyOptional({ description: '详细地址', })
  readonly address?: string;
}
